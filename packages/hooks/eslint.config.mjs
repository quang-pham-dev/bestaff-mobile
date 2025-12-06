import { config } from '@bestaff/eslint-config/react-native-library';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['prettier.config.js', '*.config.js'],
  },
];
