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

// Only skills that exist in .agents/skills are managed; Claude-only skills in .claude/skills are left alone.
const skills = existsSync(SOURCE) ? readdirSync(SOURCE).filter((name) => statSync(join(SOURCE, name)).isDirectory()) : [];
if (skills.length === 0) {
    console.error('sync-skills: no skills found in .agents/skills');
    process.exit(1);
}

function inSync(skill) {
    const source = files(join(SOURCE, skill)).sort();
    const target = files(join(TARGET, skill)).sort();
    if (source.join('\n') !== target.join('\n')) return false;
    return source.every((file) =>
        readFileSync(join(SOURCE, skill, file)).equals(readFileSync(join(TARGET, skill, file))),
    );
}

if (process.argv.includes('--check')) {
    const stale = skills.filter((skill) => !inSync(skill));
    if (stale.length) {
        console.error(`sync-skills: .claude/skills out of date for: ${stale.join(', ')}. Run \`npm run sync:skills\` and commit.`);
        process.exit(1);
    }
    console.log(`sync-skills: ${skills.length} skills in sync`);
} else {
    for (const skill of skills) {
        rmSync(join(TARGET, skill), { recursive: true, force: true });
        cpSync(join(SOURCE, skill), join(TARGET, skill), { recursive: true });
    }
    console.log(`sync-skills: copied ${skills.join(', ')} to .claude/skills`);
}
