#!/bin/bash

file_path=$(cat)

if [ -z "$file_path" ]; then
  exit 0
fi

filename=$(basename "$file_path")
extension="${filename##*.}"

case "$filename" in
  *.js|*.ts|*.cjs|*.mjs|*.d.cts|*.d.mts|*.jsx|*.tsx|*.json|*.jsonc)
    npx biome check --write --no-errors-on-unmatched "$file_path"
    npx biome check --write --unsafe --no-errors-on-unmatched "$file_path"
    npx biome format --write --no-errors-on-unmatched "$file_path"
    npx biome lint --write --no-errors-on-unmatched "$file_path"
    npx biome check --files-ignore-unknown=true "$file_path"
    ;;
esac

case "$filename" in
  *.ts|*.tsx)
    npm run types:check
    ;;
esac
