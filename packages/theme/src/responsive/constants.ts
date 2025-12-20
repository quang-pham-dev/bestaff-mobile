/**
 * Responsive Constants
 *
 * Baseline dimensions and configuration for responsive scaling.
 * Based on industry standards and accessibility guidelines.
 */

// =============================================================================
// BASELINE DIMENSIONS
// =============================================================================

/**
 * iPhone 8 width - Standard baseline for horizontal scaling
 * Most design tools use 375 as the default mobile artboard width
 */
export const GUIDELINE_BASE_WIDTH = 375;

/**
 * iPhone X/11 height - Standard baseline for vertical scaling
 * Accounts for modern devices with taller aspect ratios
 */
export const GUIDELINE_BASE_HEIGHT = 812;

// =============================================================================
// BREAKPOINT THRESHOLDS
// =============================================================================

/**
 * Behavioral breakpoints (not pixel-perfect CSS breakpoints)
 *
 * - Small:    < 360px  → Stack, scroll, minimal chrome
 * - Baseline: 360-420px → Default spacing/sizing (design baseline)
 * - Large:    420-768px → Moderate enlargement
 * - Tablet:   >= 768px  → Max-width constraints, multi-column layouts
 */
export const BREAKPOINT_SMALL = 360;
export const BREAKPOINT_BASELINE = 420;
export const BREAKPOINT_LARGE = 768;

// =============================================================================
// FONT CONSTRAINTS
// =============================================================================

/**
 * Minimum font size for accessibility
 * Never scale text below this value regardless of screen size
 */
export const MIN_FONT_SIZE = 10;

/**
 * Maximum font size to prevent layout breaks
 * Prevents excessively large text on tablets
 */
export const MAX_FONT_SIZE = 32;

/**
 * Default moderate scale factor
 * 0.5 = 50% of the difference between base and scaled size
 * Industry standard used by react-native-size-matters
 */
export const DEFAULT_SCALE_FACTOR = 0.5;

// =============================================================================
// ACCESSIBILITY
// =============================================================================

/**
 * Minimum touch target size (iOS HIG / Material Design)
 * All interactive elements should be at least this size
 */
export const MIN_TOUCH_TARGET = 44;
