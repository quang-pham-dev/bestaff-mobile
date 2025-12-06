# ESLint Configuration Examples

This directory contains practical examples of how to use the `@bestaff/eslint-config` package in different project types.

## Mobile Application Examples

### React Native Bare Project

```javascript
// eslint.config.js
import { config as reactNativeConfig } from '@bestaff/eslint-config/react-native-library.json';
import { config as testingConfig } from '@bestaff/eslint-config/testing';

export default [
  ...reactNativeConfig,
  {
    ...testingConfig,
    files: ['**/*.test.{js,ts,jsx,tsx}'],
  },
  {
    // Platform-specific file handling
    files: ['**/*.ios.{js,ts,jsx,tsx}', '**/*.android.{js,ts,jsx,tsx}'],
    rules: {
      'react-native/split-platform-components': 'off',
    },
  },
  {
    ignores: ['android/**', 'ios/**', 'node_modules/**', 'metro.config.js'],
  },
];
```

### Expo Project

```javascript
// eslint.config.js
import { config as reactNativeConfig } from '@bestaff/eslint-config/react-native-library.json';

export default [
  ...reactNativeConfig,
  {
    // Expo-specific globals
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
        __EXPO_DEV__: 'readonly',
        expo: 'readonly',
      },
    },
  },
  {
    files: ['app.config.{js,ts}', 'metro.config.js'],
    rules: {
      'import/no-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
```

These examples provide practical, real-world configurations that developers can use as starting points for their specific project types.
