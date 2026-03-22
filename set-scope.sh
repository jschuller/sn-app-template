#!/bin/bash
# set-scope.sh — Rename the scope prefix across all source files.
#
# Usage: ./set-scope.sh x_XXXX_myapp
#
# This replaces every occurrence of the default scope prefix (x_snc_example)
# with your new prefix in all source files, now.config.json, and CLAUDE.md.

set -euo pipefail

OLD_PREFIX="x_snc_example"
NEW_PREFIX="${1:-}"

if [ -z "$NEW_PREFIX" ]; then
    echo "Usage: ./set-scope.sh <new_scope_prefix>"
    echo "Example: ./set-scope.sh x_myco_myapp"
    exit 1
fi

if [ "$OLD_PREFIX" = "$NEW_PREFIX" ]; then
    echo "New prefix is the same as the current prefix. Nothing to do."
    exit 0
fi

# Validate format: must start with x_ and contain only lowercase alphanumeric + underscores
if ! echo "$NEW_PREFIX" | grep -qE '^x_[a-z0-9]+_[a-z0-9_]+$'; then
    echo "Error: Scope prefix must match pattern x_<vendor>_<app> (lowercase alphanumeric + underscores)"
    echo "Example: x_myco_myapp"
    exit 1
fi

echo "Renaming scope: $OLD_PREFIX → $NEW_PREFIX"
echo ""

# Files to update (source + config, not node_modules or generated)
FILES=$(find . \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './dist/*' \
    -not -path './target/*' \
    -not -path './@types/*' \
    -not -path './src/fluent/generated/*' \
    -not -name 'set-scope.sh' \
    -type f \( -name '*.ts' -o -name '*.js' -o -name '*.jsx' -o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.md' -o -name '*.example' \))

COUNT=0
for file in $FILES; do
    if grep -q "$OLD_PREFIX" "$file" 2>/dev/null; then
        sed -i '' "s/${OLD_PREFIX}/${NEW_PREFIX}/g" "$file"
        echo "  Updated: $file"
        COUNT=$((COUNT + 1))
    fi
done

echo ""
echo "Done. Updated $COUNT files."
echo ""
echo "Next steps:"
echo "  1. Update now.config.json scopeId with your instance's sys_app sys_id"
echo "  2. npm run build"
echo "  3. now-sdk install --auth YOUR_ALIAS"
