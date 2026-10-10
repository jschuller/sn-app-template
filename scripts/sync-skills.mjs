#!/usr/bin/env node
/**
 * Copies the canonical skills in .agents/skills/ (read by Codex, Pi and other Agent Skills clients)
 * to .claude/skills/ (read by Claude Code). Real copies, not symlinks, so Windows checkouts work.
 *
 *   npm run sync:skills            write the copies
 *   npm run sync:skills -- --check exit 1 if the copies are out of date (CI)
 */
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, '.agents', 'skills');
const TARGET = join(ROOT, '.claude', 'skills');

function files(dir, base = dir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? files(path, base) : [relative(base, path)];
    });
}

function inSync() {
    const source = files(SOURCE).sort();
    const target = files(TARGET).sort();
    if (source.join('\n') !== target.join('\n')) return false;
    return source.every((file) => readFileSync(join(SOURCE, file)).equals(readFileSync(join(TARGET, file))));
}

if (process.argv.includes('--check')) {
    if (!inSync()) {
        console.error('sync-skills: .claude/skills differs from .agents/skills. Run `npm run sync:skills` and commit.');
        process.exit(1);
    }
    console.log('sync-skills: in sync');
} else {
    rmSync(TARGET, { recursive: true, force: true });
    cpSync(SOURCE, TARGET, { recursive: true });
    console.log(`sync-skills: copied ${files(SOURCE).length} files to .claude/skills`);
}
