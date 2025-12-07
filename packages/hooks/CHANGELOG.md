# Changelog

## 0.2.0

### Minor Changes

- ### Features
  - Add comprehensive unit tests for all hooks using Vitest
  - Add Vitest configuration with React Native testing support

  ### Refactoring
  - Rename hook files to use kebab-case convention for consistency:
    - `ThemeContext.tsx` → `theme-context.tsx`
    - `ThemeStylesContext.tsx` → `theme-styles-context.tsx`
    - `useColorScheme.ts` → `use-color-scheme.ts`
    - `useDebounce.ts` → `use-debounce.ts`
    - `useEntryAnimation.ts` → `use-entry-animation.ts`
    - `useThemeColor.ts` → `use-theme-color.ts`
    - `useThemeStyles.ts` → `use-theme-styles.ts`
    - `useThemeValue.ts` → `use-theme-value.ts`
    - `useThemeVariant.ts` → `use-theme-variant.ts`
    - `useTheme.ts` → `use-theme.ts`

  ### Chores
  - Add `.prettierignore` to exclude build outputs
  - Update exports in `index.ts` to reflect new file names

### Patch Changes

- Updated dependencies
  - @bestaff/utils@0.0.1
  - @bestaff/theme@0.0.1

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-07

### Added

- Comprehensive unit test suite for all 14 hooks
- Test infrastructure with Vitest 3.2+ configuration
- Mock setup for React Native, Expo, and Reanimated dependencies
- Exported types for improved IntelliSense support:
  - `UseAppStateProps`
  - `EntryAnimationConfig`
  - `ThemeColorProps`
  - `Variants`
  - `VariantFunction`

### Changed

- File naming convention updated to kebab-case for consistency:
  - `ThemeContext.tsx` → `theme-context.tsx`
  - `ThemeStylesContext.tsx` → `theme-styles-context.tsx`
  - `useTheme.ts` → `use-theme.ts`
  - `useThemeStyles.ts` → `use-theme-styles.ts`
  - `useThemeColor.ts` → `use-theme-color.ts`
  - `useThemeValue.ts` → `use-theme-value.ts`
  - `useThemeVariant.ts` → `use-theme-variant.ts`
  - `useDebounce.ts` → `use-debounce.ts`
  - `useColorScheme.ts` → `use-color-scheme.ts`
  - `useEntryAnimation.ts` → `use-entry-animation.ts`

### Fixed

- Internal import paths updated to use new kebab-case file names

### Notes

- **No breaking changes**: All public exports remain unchanged
- API surface is fully backward compatible
- Existing consumers do not need to update their code

## [0.0.0] - Initial

- Initial development version
