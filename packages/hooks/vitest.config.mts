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
        inline: [
          'react-native',
          '@testing-library/react-native',
          'expo-haptics',
          'expo-secure-store',
          'react-native-reanimated',
          '@react-native-async-storage/async-storage',
        ],
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
        'src/__tests__/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
