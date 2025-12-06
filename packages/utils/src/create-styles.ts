import {
  type ImageStyle,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import type { Theme, ThemeStyles } from '@bestaff/theme';

type StyleObject = Record<string, ViewStyle | TextStyle | ImageStyle>;
type StyleType = ViewStyle | TextStyle | ImageStyle | StyleObject;
type NamedStyles<T> = { [P in keyof T]: StyleType };

/**
 * Creates utility functions for managing themed styles with caching
 *
 * @param theme - The current theme object
 * @param styles - Global theme styles
 * @returns Object containing style utility functions
 *
 * @example
 * ```tsx
 * const utils = createStyleUtils(theme, styles)
 *
 * Create cached themed styles
 * const useStyles = () => {
 *   return utils.createThemedStyle((theme) => ({
 *     container: {
 *       backgroundColor: theme.colors.background
 *     }
 *   }))
 * }
 * ```
 */

// Define cache value type
type CachedStyleSheet = NamedStyles<{
  [key: string]: StyleType;
}>;

export const createStyleUtils = (theme: Theme, styles: ThemeStyles) => {
  /**
   * Cache for storing created StyleSheet objects
   * Key: Stringified style object
   * Value: Created StyleSheet object with proper typing
   */
  const styleCache = new Map<string, CachedStyleSheet>();

  return {
    getFullscreenCenteredContentStyles: () => [
      StyleSheet.absoluteFill,
      { backgroundColor: theme.colors.background },
      styles.justifyContentCenter,
      styles.alignItemsCenter,
    ],
    /**
     * Creates and caches themed styles
     *
     * @param styleCreator - Function that creates styles using theme
     * @returns Cached StyleSheet object
     *
     * @description
     * - Creates styles using the provided theme
     * - Caches results to prevent unnecessary recreations
     * - Uses JSON.stringify for cache key generation
     * - Returns cached styles if available
     *
     * @example
     * ```tsx
     * const styles = createThemedStyle((theme) => ({
     *   text: {
     *     color: theme.colors.text
     *   }
     * }))
     * ```
     */
    createThemedStyle: <T extends StyleObject>(
      styleCreator: (theme: Theme) => T,
    ): T => {
      // Generate cache key from style definition
      const cacheKey = JSON.stringify(styleCreator(theme));

      // Return cached styles if available
      if (!styleCache.has(cacheKey)) {
        const styles = StyleSheet.create(styleCreator(theme));
        styleCache.set(cacheKey, styles);
      }

      return styleCache.get(cacheKey) as T;
    },
  };
};

export type StyleUtilsType = ReturnType<typeof createStyleUtils>;

/* =============================================================================
 * SCALABILITY & MIGRATION NOTES
 * =============================================================================
 *
 * ## Current Implementation: React Native StyleSheet
 *
 * This module uses React Native's built-in `StyleSheet.create()` API for styling.
 * The factory pattern (`createStyleUtils`) provides an abstraction layer that allows
 * easy migration to alternative styling solutions if needed.
 *
 * **Pros of current approach:**
 * - Zero dependencies - uses built-in React Native APIs
 * - Native performance optimizations via StyleSheet.create()
 * - Built-in type safety with TypeScript
 * - No additional bundle size
 * - Simple and straightforward API
 *
 * **Cons of current approach:**
 * - Manual theme management required
 * - No built-in responsive utilities
 * - Cache management is manual
 * - No runtime breakpoints support
 *
 * -----------------------------------------------------------------------------
 *
 * ## Future Migration Path: react-native-unistyles
 *
 * If scalability requirements grow (e.g., complex responsive layouts, runtime theming,
 * advanced breakpoints), this module can be easily migrated to `react-native-unistyles`.
 *
 * @see https://github.com/jpudysz/react-native-unistyles
 *
 * **Migration Benefits:**
 * - Built-in responsive design with breakpoints
 * - Runtime theme switching without re-renders
 * - TypeScript-first with better autocompletion
 * - Automatic memoization and caching
 * - Dynamic runtime values (dimensions, orientation)
 * - Better developer experience with variants
 *
 * **Migration Strategy:**
 * 1. Install: `pnpm add react-native-unistyles`
 * 2. Replace `StyleSheet.create()` with `createStyleSheet()`
 * 3. Update theme integration to use UnistylesRegistry
 * 4. Add breakpoints and responsive utilities as needed
 * 5. Update type definitions to use Unistyles types
 *
 * **Example Migration:**
 *
 * ```tsx
 * // Before (Current Implementation)
 * const styles = createThemedStyle((theme) => ({
 *   container: { backgroundColor: theme.colors.background }
 * }))
 *
 * // After (Unistyles Migration)
 * import { createStyleSheet, useStyles } from 'react-native-unistyles'
 *
 * const stylesheet = createStyleSheet((theme) => ({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     // Unistyles supports responsive breakpoints directly!
 *     padding: {
 *       xs: 8,
 *       md: 16,
 *       lg: 24
 *     }
 *   }
 * }))
 *
 * // In component
 * const { styles } = useStyles(stylesheet)
 * ```
 *
 * -----------------------------------------------------------------------------
 *
 * ## Design Decisions
 *
 * - **Abstraction Layer**: The `createStyleUtils` factory pattern allows swapping
 *   the underlying styling implementation without changing consumer code
 *
 * - **Caching Strategy**: Manual cache using Map + JSON.stringify ensures styles
 *   are only created once per unique style definition
 *
 * - **Type Safety**: Full TypeScript support with proper style type inference
 *
 * - **Theme Integration**: Direct theme object access for consistent styling
 *
 * =============================================================================
 */
