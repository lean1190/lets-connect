import path from 'node:path';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    setupFiles: [
      './src/test/setup.ts',
      './src/lib/__mocks__/openai.ts',
      './src/lib/__mocks__/server-actions.ts',
      './src/lib/__mocks__/supabase.ts',
      './src/lib/__mocks__/next/server.ts'
    ],
    reporters: ['dot'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary'],
      exclude: [
        'lint-staged.config.ts',
        'next.config.ts',
        'postcss.config.mjs',
        ...coverageConfigDefaults.exclude
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
