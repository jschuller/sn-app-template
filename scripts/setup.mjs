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
const TEMPLATE_NAME = 'Example App';
const SCOPE_PATTERN = /^(x|sn)_[a-z0-9_]+$/;
const MAX_SCOPE_LENGTH = 18;

const HELP = `Usage: npm run setup -- --scope <scope> --name "<App Name>" [--dry-run] [--force]

  --scope    New application scope, e.g. x_1234_myapp (max ${MAX_SCOPE_LENGTH} characters).
             Use your instance's vendor prefix: glide.appcreator.company.code.
  --name     Display name, e.g. "Asset Tracker".
  --dry-run  Show what would change; write nothing.
  --force    Run even if the git working tree has uncommitted changes.`;

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
    if (!values.name.trim()) fail('--name must not be empty.');
    return { scope: values.scope, name: values.name.trim(), dryRun: values['dry-run'], force: values.force };
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

/** Files git tracks or would track (ignored files stay untouched); a plain walk outside git. */
function textFiles() {
    let files;
    try {
        files = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
    } catch {
        files = [...walk(ROOT)].map((path) => relative(ROOT, path));
    }
    return files
        .filter((file) => TEXT_EXTENSIONS.test(file) && !SKIP_FILES.has(file))
        .filter((file) => !file.split(/[\\/]/).some((part) => SKIP_DIRS.has(part)))
        .filter((file) => existsSync(join(ROOT, file)))
        .map((file) => join(ROOT, file));
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
    if (oldScope === scope && config.name === name) fail(`already set up as ${scope} ("${name}").`);
    ensureCleanTree(force || dryRun);
    if (scope.startsWith('x_snc_')) {
        console.warn('setup: warning: x_snc_ is ServiceNow\'s own vendor prefix; most instances refuse to install it.');
    }

    const prefix = dryRun ? '[dry-run] ' : '';
    const changed = [];
    for (const file of textFiles()) {
        const before = readFileSync(file, 'utf8');
        let after = before.split(oldScope).join(scope);
        if (relative(ROOT, file).startsWith(`src${sep}`)) after = after.split(TEMPLATE_NAME).join(name);
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
        pkg.scripts[key] = command.split(TEMPLATE_NAME).join(name);
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
