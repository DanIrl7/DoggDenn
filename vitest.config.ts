import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom for browser-like environment (needed for React components)
    environment: 'jsdom',
    // Global test utilities (describe, it, expect) - no need to import them
    globals: true,
    // Setup file runs before tests
    setupFiles: [],
  },
  resolve: {
    alias: {
      // This allows imports like 'import from @/components'
      '@': path.resolve(__dirname, './'),
    },
  },
});
