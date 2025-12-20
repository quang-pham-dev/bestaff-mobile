import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.mts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/', 'dist/'],
    server: {
      deps: {
        inline: ['react-native'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/index.ts',
      ],
    },
  },
});
