import { config } from '@bestaff/eslint-config/base';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...config,
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
]);
