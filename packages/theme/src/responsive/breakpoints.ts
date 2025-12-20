/**
 * Breakpoint Utilities
 *
 * Functions for detecting and responding to different screen sizes.
 * Uses behavioral breakpoints rather than pixel-perfect CSS breakpoints.
 */
import { Dimensions } from 'react-native';

import {
  BREAKPOINT_BASELINE,
  BREAKPOINT_LARGE,
  BREAKPOINT_SMALL,
} from './constants';
import type { BreakpointKey, Breakpoints, Orientation } from './types';

// Get initial screen dimensions (static)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// BREAKPOINT DETECTION
// =============================================================================

/**
 * Get current breakpoint status
 *
 * Returns an object with boolean flags for each breakpoint.
 * Useful for conditional rendering based on multiple breakpoints.
 *
 * @param width - Screen width (defaults to initial width)
 * @returns Object with breakpoint status flags
 *
 * @example
 * ```ts
 * const bp = getBreakpoints(375);
 * // { small: false, baseline: true, large: false, tablet: false }
 *
 * if (bp.tablet) {
 *   // Render tablet layout
 * }
 * ```
 */
export const getBreakpoints = (width: number = SCREEN_WIDTH): Breakpoints => ({
  small: width < BREAKPOINT_SMALL,
  baseline: width >= BREAKPOINT_SMALL && width < BREAKPOINT_BASELINE,
  large: width >= BREAKPOINT_BASELINE && width < BREAKPOINT_LARGE,
  tablet: width >= BREAKPOINT_LARGE,
});

/**
 * Get current active breakpoint key
 *
 * Returns the single active breakpoint name.
 * Useful for switch statements or lookup tables.
 *
 * @param width - Screen width (defaults to initial width)
 * @returns Active breakpoint key
 *
 * @example
 * ```ts
 * const breakpoint = getActiveBreakpoint(800);
 * // 'tablet'
 *
 * const columns = { small: 1, baseline: 2, large: 3, tablet: 4 };
 * const numColumns = columns[breakpoint];
 * ```
 */
export const getActiveBreakpoint = (
  width: number = SCREEN_WIDTH,
): BreakpointKey => {
  if (width < BREAKPOINT_SMALL) return 'small';
  if (width < BREAKPOINT_BASELINE) return 'baseline';
  if (width < BREAKPOINT_LARGE) return 'large';
  return 'tablet';
};

// =============================================================================
// CONVENIENCE CHECKS
// =============================================================================

/**
 * Check if current screen is small (< 360px)
 *
 * Small screens should:
 * - Stack content vertically
 * - Use ScrollView liberally
 * - Minimize non-essential chrome
 */
export const isSmallScreen = (width: number = SCREEN_WIDTH): boolean =>
  width < BREAKPOINT_SMALL;

/**
 * Check if current screen is tablet (>= 768px)
 *
 * Tablets should:
 * - Use max-width constraints for content
 * - Consider multi-column layouts
 * - Increase spacing and touch targets
 */
export const isTablet = (width: number = SCREEN_WIDTH): boolean =>
  width >= BREAKPOINT_LARGE;

/**
 * Check if current screen is phone (not tablet)
 */
export const isPhone = (width: number = SCREEN_WIDTH): boolean =>
  width < BREAKPOINT_LARGE;

// =============================================================================
// ORIENTATION
// =============================================================================

/**
 * Get current orientation
 *
 * @param width - Screen width (defaults to initial width)
 * @param height - Screen height (defaults to initial height)
 * @returns 'portrait' or 'landscape'
 */
export const getOrientation = (
  width: number = SCREEN_WIDTH,
  height: number = SCREEN_HEIGHT,
): Orientation => (height >= width ? 'portrait' : 'landscape');

/**
 * Check if current orientation is portrait
 */
export const isPortrait = (
  width: number = SCREEN_WIDTH,
  height: number = SCREEN_HEIGHT,
): boolean => height >= width;

/**
 * Check if current orientation is landscape
 */
export const isLandscape = (
  width: number = SCREEN_WIDTH,
  height: number = SCREEN_HEIGHT,
): boolean => width > height;

// =============================================================================
// STATIC BREAKPOINT CONSTANTS (for StyleSheet use)
// =============================================================================

/** Pre-computed breakpoints using initial dimensions */
export const BREAKPOINTS = getBreakpoints();

/** Pre-computed active breakpoint using initial dimensions */
export const ACTIVE_BREAKPOINT = getActiveBreakpoint();

/** Pre-computed orientation using initial dimensions */
export const ORIENTATION = getOrientation();
