#!/usr/bin/env node
/**
 * Turns a fresh copy of this template into your own app: new scope, new scopeId,
 * new name, fresh record keys. Runs on Windows, macOS and Linux (Node only, no deps).
 *
 *   npm run setup -- --scope x_1234_myapp --name "My App" [--dry-run] [--force]
 *
 * Use your instance's vendor prefix (system property glide.appcreator.company.code):
 * instances refuse to install apps whose x_<vendor>_ prefix is not their own.
 */
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TEXT_EXTENSIONS = /\.(ts|js|jsx|mjs|json|html|css|md|example|ya?ml)$/;
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'target', '.now', 'generated', 'servicenow']);
// Template-maintainer docs describe the template's own scope; leave them as written.
const SKIP_FILES = new Set([
    'package-lock.json',
    'CHANGELOG.md',
    'RELEASING.md',
    'docs/compatibility.md',
    'scripts/setup.mjs',
    join('docs', 'compatibility.md'),
    join('scripts', 'setup.mjs'),
]);
const TEMPLATE_SCOPE = 'x_snc_example';
const TEMPLATE_REPO = 'jschuller/sn-app-template';
const SCOPE_PATTERN = /^(x|sn)_[a-z0-9_]+$/;
const MAX_SCOPE_LENGTH = 18;
// The name lands in TS/JS string literals, HTML and an npm script, so keep it to characters
// that need no escaping in any of them.
const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._()-]{0,79}$/;

const HELP = `Usage: npm run setup -- --scope <scope> --name "<App Name>" [--dry-run] [--force]

  --scope    New application scope, e.g. x_1234_myapp (max ${MAX_SCOPE_LENGTH} characters).
             Use your instance's vendor prefix: glide.appcreator.company.code.
  --name     Display name, e.g. "Asset Tracker" (letters, digits, spaces, . _ ( ) -).
  --dry-run  Show what would change; write nothing.
  --force    Run on a dirty working tree, or set up again an app that was already set up
             (that creates a new app on the instance: new scopeId, new sys_ids).`;

function fail(message) {
    console.error(`setup: ${message}`);
    process.exit(1);
}

function parseOptions() {
    const { values } = parseArgs({
        options: {
            scope: { type: 'string' },
            name: { type: 'string' },
            'dry-run': { type: 'boolean', default: false },
            force: { type: 'boolean', default: false },
            help: { type: 'boolean', short: 'h', default: false },
        },
    });
    if (values.help) {
        console.log(HELP);
        process.exit(0);
    }
    if (!values.scope || !values.name) fail(`--scope and --name are required.\n\n${HELP}`);
    if (!SCOPE_PATTERN.test(values.scope)) {
        fail(`scope "${values.scope}" must match ${SCOPE_PATTERN} (lowercase letters, digits, underscores).`);
    }
    if (values.scope.length > MAX_SCOPE_LENGTH) {
        fail(`scope "${values.scope}" is longer than ${MAX_SCOPE_LENGTH} characters; the instance would truncate it.`);
    }
    const name = values.name.trim();
    if (!NAME_PATTERN.test(name)) {
        fail(`name "${name}" may contain letters, digits, spaces and . _ ( ) - only (max 80 characters).`);
    }
    return { scope: values.scope, name, dryRun: values['dry-run'], force: values.force };
}

function ensureCleanTree(force) {
    let status;
    try {
        status = git('status', '--porcelain');
    } catch {
        return; // not a git checkout
    }
    if (status.trim() && !force) {
        fail('the git working tree has uncommitted changes. Commit or stash them, or pass --force.');
    }
}

function git(...args) {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

/** Files git tracks or would track; outside git, a walk that honours simple .gitignore entries. */
function textFiles() {
    let files;
    try {
        files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
    } catch {
        const ignored = gitignoreMatcher();
        files = [...walk(ROOT)].map((path) => relative(ROOT, path).split(sep).join('/')).filter((file) => !ignored(file));
    }
    return files
        .filter((file) => TEXT_EXTENSIONS.test(file) && !SKIP_FILES.has(file))
        .filter((file) => !file.split(/[\\/]/).some((part) => SKIP_DIRS.has(part)))
        .filter((file) => existsSync(join(ROOT, file)))
        .map((file) => join(ROOT, file));
}

/** Supports the .gitignore forms this repository uses: `name`, `dir/`, `path/to/file`, `*` wildcards. */
function gitignoreMatcher() {
    const path = join(ROOT, '.gitignore');
    if (!existsSync(path)) return () => false;
    const patterns = readFileSync(path, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && !line.startsWith('!'))
        .map((line) => {
            const dirOnly = line.endsWith('/');
            const body = line.replace(/^\/|\/$/g, '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
            const anchored = line.replace(/\/$/, '').includes('/');
            return new RegExp(`${anchored ? '^' : '(^|/)'}${body}${dirOnly ? '/' : '(/|$)'}`);
        });
    return (file) => patterns.some((pattern) => pattern.test(file));
}

function* walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) yield* walk(path);
        } else {
            yield path;
        }
    }
}

/** owner/repo of a GitHub origin remote, or null. */
function originRepo() {
    try {
        const url = git('remote', 'get-url', 'origin').trim();
        const match = url.match(/github\.com[:/]([^/]+\/[^/]+?)(\.git)?$/);
        return match && match[1] !== TEMPLATE_REPO ? match[1] : null;
    } catch {
        return null;
    }
}

function slug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'servicenow-app';
}

function readJson(path) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, data, dryRun) {
    if (!dryRun) writeFileSync(path, `${JSON.stringify(data, null, 4)}\n`);
}

function main() {
    const { scope, name, dryRun, force } = parseOptions();
    const configPath = join(ROOT, 'now.config.json');
    const config = readJson(configPath);
    const oldScope = config.scope;
    const oldName = config.name;
    if (oldScope !== TEMPLATE_SCOPE && !force) {
        fail(`this app is already set up as ${oldScope} ("${oldName}"). Running setup again creates a new app on the ` +
            'instance (new scopeId and sys_ids). Pass --force if that is what you want.');
    }
    if (oldScope === scope && oldName === name) fail(`already set up as ${scope} ("${name}").`);
    ensureCleanTree(force || dryRun);
    const repo = originRepo();
    if (scope.startsWith('x_snc_')) {
        console.warn('setup: warning: x_snc_ is ServiceNow\'s own vendor prefix; most instances refuse to install it.');
    }

    const prefix = dryRun ? '[dry-run] ' : '';
    const changed = [];
    for (const file of textFiles()) {
        const before = readFileSync(file, 'utf8');
        let after = before.split(oldScope).join(scope);
        if (relative(ROOT, file).startsWith(`src${sep}`)) after = after.split(oldName).join(name);
        if (repo) after = after.split(TEMPLATE_REPO).join(repo);
        if (after !== before) {
            changed.push(relative(ROOT, file));
            if (!dryRun) writeFileSync(file, after);
        }
    }

    // Re-read: the loop above may have rewritten the scope inside now.config.json.
    const scopeId = randomUUID().replace(/-/g, '');
    writeJson(configPath, { ...readJson(configPath), scope, scopeId, name }, dryRun);

    const pkgPath = join(ROOT, 'package.json');
    const pkg = readJson(pkgPath);
    Object.assign(pkg, { name: slug(name), version: '0.1.0', description: `${name} (ServiceNow scoped app)` });
    for (const [key, command] of Object.entries(pkg.scripts ?? {})) {
        pkg.scripts[key] = command.split(oldName).join(name);
    }
    writeJson(pkgPath, pkg, dryRun);

    const lockPath = join(ROOT, 'package-lock.json');
    if (existsSync(lockPath)) {
        const lock = readJson(lockPath);
        lock.name = pkg.name;
        lock.version = pkg.version;
        if (lock.packages?.['']) Object.assign(lock.packages[''], { name: pkg.name, version: pkg.version });
        writeJson(lockPath, lock, dryRun);
    }

    const changelog = `# Changelog\n\nAll notable changes to ${name} are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).\n\n## [Unreleased]\n`;
    if (!dryRun) writeFileSync(join(ROOT, 'CHANGELOG.md'), changelog);

    // Fresh record keys: the template's keys.ts would give every copy the same sys_ids.
    for (const dir of ['src/fluent/generated', 'dist', '.now']) {
        if (!dryRun) rmSync(join(ROOT, dir), { recursive: true, force: true });
    }

    console.log(`${prefix}Scope ${oldScope} -> ${scope}, name "${name}", new scopeId ${scopeId}`);
    console.log(`${prefix}Rewrote ${changed.length} files; reset package.json (0.1.0), CHANGELOG.md and src/fluent/generated/.`);
    for (const file of changed) console.log(`${prefix}  ${file}`);
    if (repo) {
        console.log(`${prefix}Pointed links to ${TEMPLATE_REPO} (badges, security reports) at ${repo}.`);
    } else {
        console.log(`${prefix}No GitHub origin found: update the ${TEMPLATE_REPO} links in README.md, SECURITY.md and .github/ yourself.`);
    }
    if (dryRun) return;
    console.log(`
Next steps:
  1. npx now-sdk auth --add https://<instance>.service-now.com --type oauth --alias <alias>
  2. npm run build          (creates a new src/fluent/generated/keys.ts — commit it)
  3. npm run deploy -- --auth <alias>
  4. npm run test:instance -- --auth <alias>
  5. git add -A && git commit -m "chore: set up ${scope}"`);
}

main();
