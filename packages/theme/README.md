# @bestaff/theme

<div align="center">

A comprehensive design system and theming solution for BestAff React Native applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)

</div>

---

## 📋 Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Design Tokens](#design-tokens)
- [Theme Configuration](#theme-configuration)
- [Best Practices](#best-practices)

## 🚀 Installation

This package is part of the BestAff monorepo and is automatically available to workspace packages.

```typescript
import { darkTheme, lightTheme, tokens } from '@bestaff/theme';
import { colors, spacing } from '@bestaff/theme/tokens';
import { Theme } from '@bestaff/theme/types';
```

## ✨ Features

- 🎨 **Design Tokens** - Centralized color, spacing, typography, and more
- 🌓 **Theme Support** - Built-in light and dark theme configurations
- 📏 **Type-Safe** - Full TypeScript support with auto-completion
- 📱 **Responsive** - Screen dimension utilities
- 🔧 **Customizable** - Easy to extend and override
- ⚡ **Tree-Shakeable** - Import only what you need

## 💡 Usage

### Basic Theme Usage

```typescript
import { lightTheme, darkTheme } from '@bestaff/theme';
import { useColorScheme } from 'react-native';

function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello World</Text>
    </View>
  );
}
```

### Using Design Tokens

```typescript
import { borderRadius, palette, spacing, typography } from '@bestaff/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: palette.primary,
  },
  text: {
    ...typography.bodyLarge,
    color: palette.gray900,
  },
});
```

### Theme Provider Pattern

```typescript
import { createContext, useContext } from 'react';
import { Theme, lightTheme, darkTheme } from '@bestaff/theme';

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Using with Components

```typescript
import { useTheme } from './ThemeProvider';

function MyComponent() {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text style={{ ...theme.typography.heading1, color: theme.colors.text }}>
        Themed Component
      </Text>
    </View>
  );
}
```

## 📖 API Reference

### Theme Interface

```typescript
interface Theme {
  mode: 'light' | 'dark';
  colors: ColorTokens;
  spacing: SpacingTokens;
  gap: GapTokens;
  typography: TypographyTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
}
```

### Exported Items

```typescript
// Themes
export const lightTheme: Theme;
export const darkTheme: Theme;

// Tokens
export const palette: ColorPalette;
export const spacing: SpacingTokens;
export const gap: GapTokens;
export const typography: TypographyTokens;
export const borderRadius: BorderRadiusTokens;
export const shadows: ShadowTokens;

// Dimensions
export const screen: ScreenDimensions;

// Types
export type { Theme, ThemeMode, ThemeStyles };
```

## 🎨 Design Tokens

### Colors

#### Base Palette

```typescript
const palette = {
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Primary
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  info: '#3B82F6',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};
```

#### Theme Colors

Light theme colors are mapped for semantic use:

```typescript
colors: {
  // Base
  white: palette.white,
  black: palette.black,
  transparent: palette.transparent,

  // Backgrounds
  background: palette.white,
  surface: palette.gray50,
  surfaceHover: palette.gray100,
  surfacePressed: palette.gray200,

  // Text
  text: palette.gray900,
  textSecondary: palette.gray600,
  textDisabled: palette.gray400,
  textInverse: palette.white,

  // Borders
  border: palette.gray200,
  borderFocus: palette.primary,

  // Actions
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryPressed: palette.primaryDark,
  primaryDisabled: palette.primaryLight,

  // Status
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  errorLight: palette.errorLight,
  info: palette.info,

  // Components
  card: palette.white,
  cardPressed: palette.gray50,
  overlay: palette.overlay,
  shadow: palette.shadow,
}
```

### Spacing

```typescript
const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
};
```

### Gap

```typescript
const gap = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};
```

### Typography

```typescript
const typography = {
  // Headings
  heading1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  heading2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  heading3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  heading4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },

  // Body
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 16,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};
```

### Border Radius

```typescript
const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
```

### Shadows

```typescript
const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
```

## 🔧 Theme Configuration

### Light Theme

```typescript
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    /* light mode colors */
  },
  spacing,
  gap,
  typography,
  borderRadius,
  shadows,
};
```

### Dark Theme

```typescript
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: palette.gray900,
    surface: palette.gray800,
    text: palette.gray50,
    /* other dark mode colors */
  },
  spacing,
  gap,
  typography,
  borderRadius,
  shadows,
};
```

## 📏 Dimensions

```typescript
import { screen } from '@bestaff/theme';

const styles = StyleSheet.create({
  container: {
    width: screen.width,
    height: screen.height,
  },
  halfScreen: {
    width: screen.width / 2,
  },
});
```

## 🎯 Best Practices

### 1. Use Semantic Color Names

```typescript
// ❌ Don't
<View style={{ backgroundColor: '#3B82F6' }}>

// ✅ Do
<View style={{ backgroundColor: theme.colors.primary }}>
```

### 2. Use Consistent Spacing

```typescript
// ❌ Don't
<View style={{ padding: 15 }}>

// ✅ Do
<View style={{ padding: theme.spacing.md }}>
```

### 3. Use Typography Tokens

```typescript
// ❌ Don't
<Text style={{ fontSize: 32, fontWeight: 'bold' }}>

// ✅ Do
<Text style={theme.typography.heading1}>
```

### 4. Leverage Theme Context

```typescript
// ✅ Create a theme hook
const useTheme = () => useContext(ThemeContext);

// ✅ Use it in components
function MyComponent() {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.colors.background }} />;
}
```

### 5. Type-Safe Styles

```typescript
import { Theme } from '@bestaff/theme';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.lg,
    },
  });
```

## 🔄 Extending the Theme

### Add Custom Colors

```typescript
import { lightTheme } from '@bestaff/theme';

const customTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    brand: '#FF6B6B',
    accent: '#4ECDC4',
  },
};
```

### Add Custom Tokens

```typescript
const customSpacing = {
  ...spacing,
  huge: 96,
  massive: 128,
};
```

## 📝 TypeScript Support

Full type definitions are included:

```typescript
import type {
  ColorPalette,
  SpacingTokens,
  Theme,
  ThemeMode,
  ThemeStyles,
  TypographyTokens,
} from '@bestaff/theme';
```

## 🤝 Contributing

To add new tokens or modify the theme:

1. Update token definitions in `src/tokens.ts`
2. Update theme configurations in `src/theme.ts`
3. Export types in `src/types.ts`
4. Update this README with examples

---

<div align="center">
Part of the @bestaff monorepo
</div>
