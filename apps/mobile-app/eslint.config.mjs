// https://docs.expo.dev/eslint-config/
import { config } from '@bestaff/eslint-config/react-native-library';
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...config,
  expoConfig,
  {
    ignores: ['dist/*', '*.config.js'],
  },
  {
    rules: {
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'off',
    },
  },
]);
