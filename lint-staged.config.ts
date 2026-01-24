/**
 * @filename: lint-staged.config.mts
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}': [
    'npx biome check --write --no-errors-on-unmatched', // Format, sort imports, lint, and apply safe fixes
    'npx biome check --write --unsafe --no-errors-on-unmatched', // Format, sort imports, lints, apply safe/unsafe fixes
    'npx biome format --write --no-errors-on-unmatched', // Format
    'npx biome lint --write --no-errors-on-unmatched', // Lint and apply safe fixes
    'npx biome check --files-ignore-unknown=true' // Check formatting and lint
  ],
  '*.{ts,tsx}': [() => 'npm run types:check']
};
