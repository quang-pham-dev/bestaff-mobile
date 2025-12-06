import { config } from '@bestaff/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['prettier.config.js', '*.config.js'],
  },
  {
    files: [
      'src/logger.ts',
      'src/factory.ts',
      'src/middleware.ts',
      'src/metrics.ts',
      'src/formatters.ts',
      'src/types.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
];
