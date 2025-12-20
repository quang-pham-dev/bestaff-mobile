/**
 * Font Utilities
 *
 * Functions for responsive and accessible font sizing.
 * Respects min/max bounds to ensure readability across all devices.
 */
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from './constants';
import { clamp, moderateScale, roundToPixel } from './scaling';

// =============================================================================
// FONT NORMALIZATION
// =============================================================================

/**
 * Normalize font size with moderate scaling and clamping
 *
 * Applies moderate scaling to prevent aggressive size changes,
 * then clamps to min/max bounds for accessibility.
 *
 * @param size - Base font size
 * @param factor - Scale factor (default: 0.5)
 * @param minSize - Minimum font size (default: 10)
 * @param maxSize - Maximum font size (default: 32)
 * @returns Normalized, pixel-aligned font size
 *
 * @example
 * ```ts
 * normalizeFont(16) // Returns moderately scaled and clamped value
 * normalizeFont(8, 0.5, 10) // Returns 10 (clamped to min)
 * normalizeFont(40, 0.5, 10, 32) // Returns 32 (clamped to max)
 * ```
 */
export const normalizeFont = (
  size: number,
  factor: number = 0.5,
  minSize: number = MIN_FONT_SIZE,
  maxSize: number = MAX_FONT_SIZE,
): number => {
  const scaled = moderateScale(size, factor);
  const rounded = roundToPixel(scaled);
  return clamp(rounded, minSize, maxSize);
};

/**
 * Create responsive font sizes from a typography scale
 *
 * Applies normalizeFont to all values in a typography object.
 * Useful for creating responsive token sets.
 *
 * @param fontSizes - Object with font size values
 * @param factor - Scale factor (default: 0.5)
 * @returns Object with normalized font sizes
 *
 * @example
 * ```ts
 * const baseFonts = { sm: 12, md: 16, lg: 20 };
 * const responsiveFonts = createResponsiveFontSizes(baseFonts);
 * // { sm: 12.x, md: 16.x, lg: 20.x }
 * ```
 */
export const createResponsiveFontSizes = <T extends Record<string, number>>(
  fontSizes: T,
  factor: number = 0.5,
): T => {
  const result = {} as T;
  for (const key in fontSizes) {
    if (Object.prototype.hasOwnProperty.call(fontSizes, key)) {
      result[key] = normalizeFont(fontSizes[key]!, factor) as T[typeof key];
    }
  }
  return result;
};

// =============================================================================
// VARIANT-BASED FONT SIZING
// =============================================================================

/** Font variant with optimized scale factors */
export type FontVariant = 'body' | 'heading' | 'caption' | 'label';

/** Scale factors optimized for different font variants */
const VARIANT_FACTORS: Record<FontVariant, number> = {
  heading: 0.4, // Less aggressive - headings shouldn't grow too much
  body: 0.5, // Balanced scaling
  label: 0.5, // Same as body
  caption: 0.6, // Slightly more - small text needs more help on small screens
};

/**
 * Get font size for specific typography variant
 *
 * Uses optimized scale factors for different text types.
 *
 * @param baseSize - Base font size
 * @param variant - Font variant type
 * @returns Variant-optimized font size
 *
 * @example
 * ```ts
 * getResponsiveFontSize(24, 'heading') // Less scaling for headings
 * getResponsiveFontSize(16, 'body') // Standard scaling
 * getResponsiveFontSize(12, 'caption') // More scaling for small text
 * ```
 */
export const getResponsiveFontSize = (
  baseSize: number,
  variant: FontVariant = 'body',
): number => normalizeFont(baseSize, VARIANT_FACTORS[variant]);

// =============================================================================
// SHORTHAND ALIAS
// =============================================================================

/** Alias for normalizeFont */
export const nf = normalizeFont;
