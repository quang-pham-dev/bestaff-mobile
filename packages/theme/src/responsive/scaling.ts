/**
 * Responsive Scaling Utilities
 *
 * Core functions for scaling UI elements based on screen dimensions.
 * These are STATIC functions that use initial screen dimensions.
 * For dynamic (orientation-aware) scaling, use the hooks.
 */
import { Dimensions, PixelRatio } from 'react-native';

import {
  DEFAULT_SCALE_FACTOR,
  GUIDELINE_BASE_HEIGHT,
  GUIDELINE_BASE_WIDTH,
} from './constants';

// Get initial screen dimensions (static)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// =============================================================================
// CORE SCALING FUNCTIONS
// =============================================================================

/**
 * Horizontal scale based on screen width
 *
 * Best for: horizontal margins, paddings, widths, icon sizes
 *
 * @param size - Base size in pixels (designed for 375px width)
 * @returns Scaled size for current screen width
 *
 * @example
 * ```ts
 * // If screen is 414px wide (iPhone 11):
 * scale(16) // Returns ~17.7
 * scale(100) // Returns ~110.4
 * ```
 */
export const scale = (size: number): number =>
  (SCREEN_WIDTH / GUIDELINE_BASE_WIDTH) * size;

/**
 * Vertical scale based on screen height
 *
 * Best for: vertical spacing, heights, top/bottom margins
 *
 * @param size - Base size in pixels (designed for 812px height)
 * @returns Scaled size for current screen height
 *
 * @example
 * ```ts
 * verticalScale(100) // Returns scaled value based on height ratio
 * ```
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / GUIDELINE_BASE_HEIGHT) * size;

/**
 * Moderate scale with configurable factor
 *
 * Best for: fonts, icons, elements where aggressive scaling is unpleasant
 * Uses a factor (0-1) to control how much of the scale difference to apply.
 *
 * @param size - Base size in pixels
 * @param factor - Scale factor (0 = no scaling, 1 = full scaling, default: 0.5)
 * @returns Moderately scaled size
 *
 * @example
 * ```ts
 * // If screen is 414px wide:
 * moderateScale(16, 0.5) // Returns ~16.9 (50% of the difference)
 * moderateScale(16, 0) // Returns 16 (no scaling)
 * moderateScale(16, 1) // Returns ~17.7 (full scaling)
 * ```
 */
export const moderateScale = (
  size: number,
  factor: number = DEFAULT_SCALE_FACTOR,
): number => size + (scale(size) - size) * factor;

/**
 * Moderate vertical scale with configurable factor
 *
 * Best for: vertical elements that need moderate scaling
 *
 * @param size - Base size in pixels
 * @param factor - Scale factor (default: 0.5)
 * @returns Moderately scaled size
 */
export const moderateVerticalScale = (
  size: number,
  factor: number = DEFAULT_SCALE_FACTOR,
): number => size + (verticalScale(size) - size) * factor;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Round to nearest pixel for crisp rendering
 *
 * Ensures values align to physical pixels on the device.
 * Prevents blurry edges on high-DPI screens.
 *
 * @param size - Size to round
 * @returns Pixel-aligned size
 */
export const roundToPixel = (size: number): number =>
  PixelRatio.roundToNearestPixel(size);

/**
 * Clamp value between min and max
 *
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

// =============================================================================
// SHORTHAND ALIASES (for convenience)
// =============================================================================

/** Alias for scale */
export const s = scale;

/** Alias for verticalScale */
export const vs = verticalScale;

/** Alias for moderateScale */
export const ms = moderateScale;

/** Alias for moderateVerticalScale */
export const mvs = moderateVerticalScale;
