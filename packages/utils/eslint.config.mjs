import { config } from '@bestaff/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['prettier.config.js', '*.config.js'],
  },
];
