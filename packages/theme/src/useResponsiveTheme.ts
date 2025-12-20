/**
 * Responsive Theme Hook
 *
 * Combines the theme context with responsive utilities to provide
 * a unified API for themed, responsive styling.
 *
 * @example
 * ```tsx
 * import { useResponsiveTheme } from '@bestaff/theme';
 *
 * function MyComponent() {
 *   const { theme, responsive, isTablet, scale } = useResponsiveTheme();
 *
 *   return (
 *     <View style={{
 *       padding: scale(theme.spacing.md),
 *       flexDirection: isTablet ? 'row' : 'column',
 *     }}>
 *       <Text style={{ fontSize: responsive.normalizeFont(16) }}>
 *         Hello World
 *       </Text>
 *     </View>
 *   );
 * }
 * ```
 */
import { useMemo } from 'react';
import { PixelRatio, useWindowDimensions } from 'react-native';

import {
  DEFAULT_SCALE_FACTOR,
  GUIDELINE_BASE_HEIGHT,
  GUIDELINE_BASE_WIDTH,
  getActiveBreakpoint,
  getBreakpoints,
  getOrientation,
  normalizeFont,
} from './responsive';
import type {
  BreakpointKey,
  ResponsiveConfig,
  ResponsiveValue,
} from './responsive/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ResponsiveThemeUtils {
  /** Current responsive configuration */
  responsive: ResponsiveConfig;

  /** Current active breakpoint */
  breakpoint: BreakpointKey;

  /** Whether current screen is tablet */
  isTablet: boolean;

  /** Whether current screen is small */
  isSmallScreen: boolean;

  /** Whether current orientation is portrait */
  isPortrait: boolean;

  /** Dynamic scale function (uses current dimensions) */
  scale: (size: number) => number;

  /** Dynamic vertical scale function */
  verticalScale: (size: number) => number;

  /** Dynamic moderate scale function */
  moderateScale: (size: number, factor?: number) => number;

  /** Normalize font with clamping */
  normalizeFont: typeof normalizeFont;

  /** Select value based on current breakpoint */
  selectByBreakpoint: <T>(values: ResponsiveValue<T>) => T;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook that provides responsive utilities based on current window dimensions
 *
 * This hook combines responsive calculations with real-time dimension updates.
 * Use this when you need dynamic responsiveness that updates on orientation changes.
 *
 * @returns Object with responsive configuration and utility functions
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const {
 *     responsive,
 *     isTablet,
 *     scale,
 *     selectByBreakpoint,
 *   } = useResponsiveTheme();
 *
 *   const columns = selectByBreakpoint({
 *     small: 1,
 *     baseline: 2,
 *     tablet: 3,
 *     default: 2,
 *   });
 *
 *   return (
 *     <FlatList
 *       numColumns={columns}
 *       key={columns}
 *       contentContainerStyle={{ padding: scale(16) }}
 *     />
 *   );
 * }
 * ```
 */
export function useResponsiveTheme(): ResponsiveThemeUtils {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const breakpoints = getBreakpoints(width);
    const orientation = getOrientation(width, height);
    const breakpoint = getActiveBreakpoint(width);

    const responsive: ResponsiveConfig = {
      width,
      height,
      breakpoints,
      orientation,
      pixelRatio: PixelRatio.get(),
    };

    const scale = (size: number) => (width / GUIDELINE_BASE_WIDTH) * size;

    const verticalScale = (size: number) =>
      (height / GUIDELINE_BASE_HEIGHT) * size;

    const moderateScale = (size: number, factor = DEFAULT_SCALE_FACTOR) =>
      size + (scale(size) - size) * factor;

    const selectByBreakpoint = <T>(values: ResponsiveValue<T>): T =>
      values[breakpoint] ?? values.default;

    return {
      responsive,
      breakpoint,
      isTablet: breakpoints.tablet,
      isSmallScreen: breakpoints.small,
      isPortrait: orientation === 'portrait',
      scale,
      verticalScale,
      moderateScale,
      normalizeFont,
      selectByBreakpoint,
    };
  }, [width, height]);
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

export type { ResponsiveConfig, BreakpointKey, ResponsiveValue };
