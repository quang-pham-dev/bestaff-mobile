import { StyleSheet } from 'react-native';

import type { Theme } from '../theme';
import type { StyleCreator, StyleObject } from './types';

/**
 * Global cache for storing styles per theme
 * Uses WeakMap for automatic garbage collection when theme instances are removed
 */
const globalStyleCache = new WeakMap<
  Theme,
  Map<StyleCreator<StyleObject>, StyleObject>
>();

/**
 * Creates a style factory that can be defined outside components
 *
 * This function enables defining styles outside React components while still
 * maintaining theme reactivity. Styles are cached per theme instance for
 * optimal performance.
 *
 * @template T - The type of style object being created
 * @param styleCreator - Function that receives theme and returns style object
 * @returns A factory function that returns themed styles
 *
 * @example
 * ```tsx
 * // Define styles outside component
 * const useButtonStyles = createStyles((theme) => ({
 *   button: {
 *     backgroundColor: theme.colors.primary,
 *     padding: theme.spacing.md,
 *   },
 *   text: {
 *     color: theme.colors.textInverse,
 *   },
 * }));
 *
 * // Use in component
 * export function Button() {
 *   const styles = useButtonStyles();
 *   return <Pressable style={styles.button}>...</Pressable>;
 * }
 * ```
 */
export function createStyles<T extends StyleObject>(
  styleCreator: StyleCreator<T>,
): (theme: Theme) => T {
  return function getThemedStyles(theme: Theme): T {
    // Get or create cache for this theme instance
    if (!globalStyleCache.has(theme)) {
      globalStyleCache.set(theme, new Map());
    }

    const themeCache = globalStyleCache.get(theme)!;

    // Check cache using function reference as key
    if (!themeCache.has(styleCreator)) {
      const styles = StyleSheet.create(styleCreator(theme));
      themeCache.set(styleCreator, styles);
    }

    return themeCache.get(styleCreator) as T;
  };
}

/**
 * Helper to get cache statistics (useful for debugging)
 * @internal
 */
export function getStyleCacheStats(): {
  themesCount: number;
} {
  // Note: WeakMap doesn't expose size, this is for debugging only
  return {
    themesCount: 0, // Cannot determine from WeakMap
  };
}
