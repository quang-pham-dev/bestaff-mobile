/**
 * Responsive Hooks
 *
 * React hooks that respond to dimension changes in real-time.
 * Use these for dynamic layouts that need to update on orientation change.
 */
import { useMemo } from 'react';
import { PixelRatio, useWindowDimensions } from 'react-native';

import {
  getActiveBreakpoint,
  getBreakpoints,
  getOrientation,
} from './breakpoints';
import {
  DEFAULT_SCALE_FACTOR,
  GUIDELINE_BASE_HEIGHT,
  GUIDELINE_BASE_WIDTH,
} from './constants';
import { normalizeFont } from './font';
import type {
  BreakpointKey,
  ResponsiveConfig,
  ResponsiveValue,
  ScalingUtils,
} from './types';

// =============================================================================
// MAIN RESPONSIVE HOOK
// =============================================================================

/**
 * Hook providing complete responsive configuration
 *
 * Updates automatically on dimension/orientation changes.
 *
 * @returns Complete responsive configuration object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { width, height, breakpoints, orientation } = useResponsive();
 *
 *   return (
 *     <View style={{ flexDirection: orientation === 'landscape' ? 'row' : 'column' }}>
 *       {breakpoints.tablet && <Sidebar />}
 *       <Content />
 *     </View>
 *   );
 * }
 * ```
 */
export const useResponsive = (): ResponsiveConfig => {
  const { width, height } = useWindowDimensions();

  return useMemo(
    () => ({
      width,
      height,
      breakpoints: getBreakpoints(width),
      orientation: getOrientation(width, height),
      pixelRatio: PixelRatio.get(),
    }),
    [width, height],
  );
};

// =============================================================================
// BREAKPOINT HOOKS
// =============================================================================

/**
 * Hook for current breakpoint key
 *
 * Returns the single active breakpoint name.
 * Updates on dimension changes.
 *
 * @returns Current breakpoint key
 *
 * @example
 * ```tsx
 * function MyGrid() {
 *   const breakpoint = useBreakpoint();
 *   const columns = { small: 1, baseline: 2, large: 3, tablet: 4 }[breakpoint];
 *   return <FlatList numColumns={columns} key={columns} />;
 * }
 * ```
 */
export const useBreakpoint = (): BreakpointKey => {
  const { width } = useWindowDimensions();
  return useMemo(() => getActiveBreakpoint(width), [width]);
};

/**
 * Hook for responsive value selection
 *
 * Returns different values based on current breakpoint.
 *
 * @param values - Object with values for each breakpoint
 * @returns Value for current breakpoint
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const padding = useResponsiveValue({
 *     small: 8,
 *     baseline: 16,
 *     tablet: 24,
 *     default: 16,
 *   });
 *
 *   return <View style={{ padding }} />;
 * }
 * ```
 */
export const useResponsiveValue = <T>(values: ResponsiveValue<T>): T => {
  const breakpoint = useBreakpoint();
  return values[breakpoint] ?? values.default;
};

// =============================================================================
// SCALING HOOKS
// =============================================================================

/**
 * Hook for dynamic scaling functions
 *
 * Returns scaling functions that use current window dimensions.
 * Updates on orientation/dimension changes.
 *
 * @returns Object with scaling utility functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { scale, moderateScale, normalizeFont } = useScaling();
 *
 *   return (
 *     <View style={{ padding: scale(16) }}>
 *       <Text style={{ fontSize: normalizeFont(16) }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export const useScaling = (): ScalingUtils => {
  const { width, height } = useWindowDimensions();

  return useMemo(
    () => ({
      scale: (size: number) => (width / GUIDELINE_BASE_WIDTH) * size,

      verticalScale: (size: number) => (height / GUIDELINE_BASE_HEIGHT) * size,

      moderateScale: (size: number, factor = DEFAULT_SCALE_FACTOR) =>
        size + ((width / GUIDELINE_BASE_WIDTH) * size - size) * factor,

      moderateVerticalScale: (size: number, factor = DEFAULT_SCALE_FACTOR) =>
        size + ((height / GUIDELINE_BASE_HEIGHT) * size - size) * factor,

      normalizeFont,
    }),
    [width, height],
  );
};

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook to check if current screen is tablet
 *
 * @returns true if screen width >= 768px
 */
export const useIsTablet = (): boolean => {
  const { breakpoints } = useResponsive();
  return breakpoints.tablet;
};

/**
 * Hook to check if current screen is small
 *
 * @returns true if screen width < 360px
 */
export const useIsSmallScreen = (): boolean => {
  const { breakpoints } = useResponsive();
  return breakpoints.small;
};

/**
 * Hook for current orientation
 *
 * @returns 'portrait' or 'landscape'
 */
export const useOrientation = () => {
  const { orientation } = useResponsive();
  return orientation;
};
