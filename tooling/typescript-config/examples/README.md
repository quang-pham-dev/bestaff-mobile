# TypeScript Configuration Examples

This directory contains practical examples of how to use the `@bestaff/typescript-config` package in different project types and scenarios.

## Mobile Application Examples

### React Native CLI Project

```json
// tsconfig.json
{
  "extends": "@bestaff/typescript-config/react-native-library.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/navigation/*": ["./src/navigation/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./src/assets/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  },
  "include": ["src", "index.js", "App.tsx"]
}
```

### Expo Project

```json
// tsconfig.json
{
  "extends": "@bestaff/typescript-config/react-native-library.json",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/screens/*": ["./src/screens/*"],
      "@/navigation/*": ["./src/navigation/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### React Native with Flipper

```json
// tsconfig.json
{
  "extends": "@orbit-platform/ts-config/react-native.json",
  "compilerOptions": {
    "types": ["react-native", "flipper"],
    "paths": {
      "@/*": ["./src/*"],
      "@/flipper/*": ["./src/flipper/*"]
    }
  }
}
```

These examples provide practical, real-world configurations that developers can use as starting points for their specific project types and requirements.
