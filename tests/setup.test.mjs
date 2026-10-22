/**
 * Tests for scripts/setup.mjs. Each test runs the script on a temporary copy of this repository,
 * so the checkout itself is never rewritten.
 *
 *   npm test
 *
 * They describe the template, so they skip themselves once `npm run setup` has made this an app of its own
 * (setup.mjs leaves this file as written, like its other template-maintainer files).
 */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('..', import.meta.url));
const TEMPLATE_SCOPE = 'x_snc_example';
const TEMPLATE_NAME = 'Example App';
const REPO_CONFIG = JSON.parse(readFileSync(join(REPO, 'now.config.json'), 'utf8'));
const TEMPLATE_SCOPE_ID = REPO_CONFIG.scopeId;
const SKIP = REPO_CONFIG.scope === TEMPLATE_SCOPE ? false : `already set up as ${REPO_CONFIG.scope}; these tests cover the template`;
// Files setup.mjs leaves as written (its SKIP_FILES), and directories it never rewrites.
const KEEPS_TEMPLATE_SCOPE = new Set([
    'package-lock.json',
    'RELEASING.md',
    'docs/compatibility.md',
    'scripts/setup.mjs',
    'tests/setup.test.mjs',
]);
const NOT_COPIED = new Set(['node_modules', '.git', 'dist', 'target', '.now']);
const TEXT_EXTENSIONS = /\.(ts|js|jsx|mjs|json|html|css|md|example|ya?ml)$/;

const scratch = mkdtempSync(join(tmpdir(), 'sn-app-template-setup-'));
after(() => rmSync(scratch, { recursive: true, force: true }));

// Keeps git from finding a repository above the scratch directory.
const env = { ...process.env, GIT_CEILING_DIRECTORIES: scratch };

function git(cwd, ...args) {
    return execFileSync(
        'git',
        ['-c', 'user.name=setup-test', '-c', 'user.email=setup-test@example.invalid', '-c', 'commit.gpgsign=false', ...args],
        { cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
}

/** The repository's files: tracked and untracked-but-not-ignored when it is a git checkout, else a filtered walk. */
function repoFiles() {
    try {
        return execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
            cwd: REPO,
            encoding: 'utf8',
        })
            .split('\0')
            .filter((file) => file && existsSync(join(REPO, file)));
    } catch {
        return walk(REPO).map((path) => relative(REPO, path).split(sep).join('/'));
    }
}

function walk(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (NOT_COPIED.has(entry.name)) return [];
        const path = join(dir, entry.name);
        return entry.isDirectory() ? walk(path) : [path];
    });
}

let copies = 0;
/** A fresh copy of the repository; with `withGit`, a git checkout with one commit and a GitHub origin. */
function makeCopy({ withGit }) {
    const dir = join(scratch, `copy-${(copies += 1)}`);
    for (const file of repoFiles()) {
        const target = join(dir, file);
        mkdirSync(dirname(target), { recursive: true });
        cpSync(join(REPO, file), target);
    }
    if (withGit) {
        git(dir, 'init', '-q');
        git(dir, 'add', '-A');
        git(dir, 'commit', '-q', '-m', 'template');
        git(dir, 'remote', 'add', 'origin', 'https://github.com/acme/asset-tracker.git');
    }
    return dir;
}

function setup(dir, ...args) {
    const result = spawnSync(process.execPath, [join(dir, 'scripts', 'setup.mjs'), ...args], {
        cwd: dir,
        env,
        encoding: 'utf8',
    });
    return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function readJson(dir, file) {
    return JSON.parse(readFileSync(join(dir, file), 'utf8'));
}

/** Text files setup.mjs is expected to have rewritten (POSIX-style paths). */
function rewrittenTextFiles(dir) {
    return walk(dir)
        .map((path) => relative(dir, path).split(sep).join('/'))
        .filter((file) => TEXT_EXTENSIONS.test(file) && !KEEPS_TEMPLATE_SCOPE.has(file));
}

/** Every file's content, keyed by path, to prove a refused run wrote nothing. */
function snapshot(dir) {
    return Object.fromEntries(walk(dir).map((path) => [relative(dir, path), readFileSync(path, 'utf8')]));
}

describe('setup.mjs in a git checkout', { skip: SKIP }, () => {
    const dir = makeCopy({ withGit: true });
    const first = setup(dir, '--scope', 'x_1234_ci', '--name', 'CI App');

    test('succeeds', () => {
        assert.equal(first.status, 0, first.stderr);
        assert.match(first.stdout, /Scope x_snc_example -> x_1234_ci, name "CI App", new scopeId [0-9a-f]{32}/);
    });

    test('sets the scope and name and generates a new scopeId', () => {
        const config = readJson(dir, 'now.config.json');
        assert.equal(config.scope, 'x_1234_ci');
        assert.equal(config.name, 'CI App');
        assert.match(config.scopeId, /^[0-9a-f]{32}$/);
        assert.notEqual(config.scopeId, TEMPLATE_SCOPE_ID);
        assert.ok(first.stdout.includes(config.scopeId), 'the printed scopeId is the one written');
        assert.equal(config.tsconfigPath, './src/server/tsconfig.json', 'other now.config.json keys are kept');
    });

    test('leaves no template scope outside the files it deliberately skips', () => {
        const leftovers = rewrittenTextFiles(dir).filter((file) =>
            readFileSync(join(dir, file), 'utf8').includes(TEMPLATE_SCOPE),
        );
        assert.deepEqual(leftovers, []);
    });

    test('renames the app in src/ and in package.json scripts', () => {
        assert.match(readFileSync(join(dir, 'src/client/components/App.jsx'), 'utf8'), /<h1>CI App<\/h1>/);
        const srcFiles = rewrittenTextFiles(dir).filter((file) => file.startsWith('src/'));
        const withOldName = srcFiles.filter((file) => readFileSync(join(dir, file), 'utf8').includes(TEMPLATE_NAME));
        assert.deepEqual(withOldName, []);
        const pkg = readJson(dir, 'package.json');
        assert.equal(pkg.name, 'ci-app');
        assert.equal(pkg.version, '0.1.0');
        assert.match(pkg.scripts['test:instance'], /"CI App"/);
    });

    test('updates the lockfile root, resets CHANGELOG.md and removes the generated keys', () => {
        const lock = readJson(dir, 'package-lock.json');
        assert.equal(lock.name, 'ci-app');
        assert.equal(lock.packages[''].name, 'ci-app');
        assert.equal(lock.packages[''].version, '0.1.0');
        const changelog = readFileSync(join(dir, 'CHANGELOG.md'), 'utf8');
        assert.match(changelog, /All notable changes to CI App/);
        assert.doesNotMatch(changelog, /\[1\.0\.0\]/);
        assert.equal(existsSync(join(dir, 'src/fluent/generated')), false);
    });

    test('points template repository links at the origin remote', () => {
        const security = readFileSync(join(dir, 'SECURITY.md'), 'utf8');
        assert.equal(security.includes('jschuller/sn-app-template'), false);
        assert.match(first.stdout, /at acme\/asset-tracker/);
    });

    test('refuses a second run without --force and writes nothing', () => {
        git(dir, 'add', '-A');
        git(dir, 'commit', '-q', '-m', 'set up');
        const before = snapshot(dir);
        const second = setup(dir, '--scope', 'x_1234_other', '--name', 'Other App');
        assert.equal(second.status, 1);
        assert.match(second.stderr, /already set up as x_1234_ci \("CI App"\).*Pass --force/s);
        assert.deepEqual(snapshot(dir), before);
    });

    test('the copy\'s own npm test skips these tests once it is set up', () => {
        // Without NODE_TEST_CONTEXT the child runs as a top-level test run that prints its own report.
        const childEnv = { ...env };
        delete childEnv.NODE_TEST_CONTEXT;
        const testFile = join(dir, 'tests', 'setup.test.mjs');
        const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', testFile], {
            cwd: dir,
            env: childEnv,
            encoding: 'utf8',
        });
        assert.equal(result.status, 0, result.stdout + result.stderr);
        assert.equal(result.stdout.match(/# SKIP already set up as x_1234_ci/g)?.length, 3, result.stdout);
        assert.match(result.stdout, /^# fail 0$/m);
    });

    test('a second run with --force sets up a new app with another scopeId', () => {
        const oldScopeId = readJson(dir, 'now.config.json').scopeId;
        const forced = setup(dir, '--scope', 'x_1234_other', '--name', 'Other App', '--force');
        assert.equal(forced.status, 0, forced.stderr);
        const config = readJson(dir, 'now.config.json');
        assert.equal(config.scope, 'x_1234_other');
        assert.notEqual(config.scopeId, oldScopeId);
        assert.match(readFileSync(join(dir, 'src/client/components/App.jsx'), 'utf8'), /<h1>Other App<\/h1>/);
    });
});

describe('setup.mjs refusals', { skip: SKIP }, () => {
    const dir = makeCopy({ withGit: true });
    const before = snapshot(dir);

    const unsafe = [
        ['a scope with uppercase letters', ['--scope', 'x_1234_MyApp', '--name', 'My App'], /must match/],
        ['a scope without the x_ or sn_ prefix', ['--scope', 'u_1234_app', '--name', 'My App'], /must match/],
        ['a scope with a path separator', ['--scope', 'x_1234/../app', '--name', 'My App'], /must match/],
        ['a scope longer than 18 characters', ['--scope', 'x_1234_much_too_long', '--name', 'My App'], /longer than 18/],
        ['a name with a double quote', ['--scope', 'x_1234_app', '--name', 'My "App"'], /may contain/],
        ['a name with a single quote', ['--scope', 'x_1234_app', '--name', "Bob's App"], /may contain/],
        ['a name with a backtick', ['--scope', 'x_1234_app', '--name', 'My `App`'], /may contain/],
        ['a name with HTML', ['--scope', 'x_1234_app', '--name', '<script>App'], /may contain/],
        ['a name with a shell separator', ['--scope', 'x_1234_app', '--name', 'App; rm -rf ~'], /may contain/],
        ['a name with a dollar sign', ['--scope', 'x_1234_app', '--name', 'App ${x}'], /may contain/],
        ['a name with a backslash', ['--scope', 'x_1234_app', '--name', 'App\\n'], /may contain/],
        ['a name with a newline', ['--scope', 'x_1234_app', '--name', 'My\nApp'], /may contain/],
        ['a name longer than 80 characters', ['--scope', 'x_1234_app', '--name', 'A'.repeat(81)], /may contain/],
        ['a missing --name', ['--scope', 'x_1234_app'], /--scope and --name are required/],
    ];
    for (const [label, args, message] of unsafe) {
        test(`refuses ${label}`, () => {
            const result = setup(dir, ...args);
            assert.equal(result.status, 1, result.stdout);
            assert.match(result.stderr, message);
        });
    }

    test('refuses a dirty working tree without --force', () => {
        writeFileSync(join(dir, 'notes.md'), 'local work\n');
        const result = setup(dir, '--scope', 'x_1234_app', '--name', 'My App');
        rmSync(join(dir, 'notes.md'));
        assert.equal(result.status, 1);
        assert.match(result.stderr, /uncommitted changes/);
    });

    test('--dry-run reports changes but writes nothing', () => {
        const result = setup(dir, '--scope', 'x_1234_app', '--name', 'My App', '--dry-run');
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /^\[dry-run\] Scope x_snc_example -> x_1234_app/m);
    });

    test('no refused or dry run changed a file', () => {
        assert.deepEqual(snapshot(dir), before);
    });
});

describe('setup.mjs outside git', { skip: SKIP }, () => {
    const dir = makeCopy({ withGit: false });
    // Ignored by .gitignore: the fallback walk must leave it alone.
    mkdirSync(join(dir, 'docs'), { recursive: true });
    writeFileSync(join(dir, 'docs', 'optimization-prompt.md'), `notes about ${TEMPLATE_SCOPE}\n`);
    const result = setup(dir, '--scope', 'x_1234_ci', '--name', 'CI App');

    test('succeeds and rewrites every file it should', () => {
        assert.equal(result.status, 0, result.stderr);
        assert.equal(readJson(dir, 'now.config.json').scope, 'x_1234_ci');
        const leftovers = rewrittenTextFiles(dir)
            .filter((file) => file !== 'docs/optimization-prompt.md')
            .filter((file) => readFileSync(join(dir, file), 'utf8').includes(TEMPLATE_SCOPE));
        assert.deepEqual(leftovers, []);
        assert.match(result.stdout, /No GitHub origin found/);
    });

    test('honours .gitignore in the fallback walk', () => {
        assert.equal(readFileSync(join(dir, 'docs', 'optimization-prompt.md'), 'utf8'), `notes about ${TEMPLATE_SCOPE}\n`);
    });
});
