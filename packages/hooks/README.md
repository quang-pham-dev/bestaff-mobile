# @bestaff/hooks

<div align="center">

Shared React hooks for BestAff Mobile applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Installation](#installation)
- [Theme Hooks](#theme-hooks)
- [Utility Hooks](#utility-hooks)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Types](#types)

## 🚀 Installation

This package is part of the BestAff monorepo and is automatically available to workspace packages.

```typescript
import { useDebounce, useTheme } from '@bestaff/hooks';
```

## 🎨 Theme Hooks

Hooks for managing and accessing the application theme.

### `useTheme`

Access the current theme context.

```typescript
const { theme, isDark, toggleTheme } = useTheme();
```

### `useThemeStyles`

Access the current theme styles.

```typescript
const styles = useThemeStyles();
```

### `useThemeValue`

Select a specific value from the theme.

```typescript
const primaryColor = useThemeValue((theme) => theme.colors.primary);
```

### `useThemeVariant`

Select a value based on a variant key.

```typescript
const style = useThemeVariant(
  {
    primary: (theme) => ({ backgroundColor: theme.colors.primary }),
    secondary: (theme) => ({ backgroundColor: theme.colors.secondary }),
    default: (theme) => ({ backgroundColor: theme.colors.background }),
  },
  'primary',
);
```

## 🛠 Utility Hooks

General purpose hooks for common tasks.

### `useDebounce`

Debounce a value.

```typescript
const debouncedValue = useDebounce(value, 500);
```

### `useAppState`

Handle app state changes (active, background, inactive).

```typescript
useAppState({
  match: /inactive|background/,
  nextAppState: 'active',
  callback: () => console.log('App active'),
});
```

### `useBackHandler`

Handle hardware back button press on Android.

```typescript
useBackHandler(() => {
  // Return true to prevent default behavior
  return true;
});
```

### `useHaptics`

Provide haptic feedback functions.

```typescript
const { lightImpact, success } = useHaptics();
```

### `useIsFirstTime`

Check if it is the first time the user is opening the app.

```typescript
const [isFirstTime, setIsFirstTime] = useIsFirstTime();
```

### `useEntryAnimation`

Create entry animations for components.

```typescript
const animatedStyle = useEntryAnimation({ type: 'fade', delay: 100 });
```

## 📖 Usage Examples

### Theme Integration

```typescript
import { useTheme, useThemeStyles } from '@bestaff/hooks';
import { View, Text } from 'react-native';

export function ThemedComponent() {
  const { theme } = useTheme();
  const styles = useThemeStyles();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
}
```

### Search with Debounce

```typescript
import { useState, useEffect } from 'react';
import { useDebounce } from '@bestaff/hooks';

export function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearch) {
      // Perform API search
      searchApi(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <TextInput value={searchTerm} onChangeText={setSearchTerm} />;
}
```

## 🧪 Testing

Run tests:

```bash
# From repository root
pnpm test:hooks

# From package directory
pnpm test

# With watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

## 📝 Types

This package exports useful TypeScript types:

```typescript
import type {
  EntryAnimationConfig,
  ThemeColorProps,
  // Theme types
  ThemeContextType,
  ThemeStylesContextType,
  // Utility types
  UseAppStateProps,
  VariantFunction,
  Variants,
} from '@bestaff/hooks';
```

---

<div align="center">
Part of the @bestaff monorepo
</div>
