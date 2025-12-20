/**
 * Responsive Tokens
 *
 * Pre-calculated responsive versions of theme tokens.
 * These tokens use the responsive scaling functions to provide
 * consistent sizing across different device sizes.
 *
 * @example
 * ```tsx
 * import { responsiveSpacing, responsiveTypography } from '@bestaff/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     padding: responsiveSpacing.md,
 *   },
 *   title: {
 *     fontSize: responsiveTypography.sizes.xl,
 *   },
 * });
 * ```
 */
import {
  createResponsiveFontSizes,
  moderateScale,
  normalizeFont,
  scale,
} from './responsive';
import { gap, spacing, typography } from './tokens';

// =============================================================================
// RESPONSIVE SPACING
// =============================================================================

/**
 * Responsive spacing scale
 *
 * Uses `scale()` to adjust spacing proportionally to screen width.
 * Maintains the same semantic names as the base spacing tokens.
 */
export const responsiveSpacing = {
  // Negative values
  '-xxxl': scale(spacing['-xxxl']),
  '-xxl': scale(spacing['-xxl']),
  '-xl': scale(spacing['-xl']),
  '-lg': scale(spacing['-lg']),
  '-md': scale(spacing['-md']),
  '-sm': scale(spacing['-sm']),
  '-xs': scale(spacing['-xs']),
  none: 0,
  xs: scale(spacing.xs),
  sm: scale(spacing.sm),
  md: scale(spacing.md),
  lg: scale(spacing.lg),
  xl: scale(spacing.xl),
  xxl: scale(spacing.xxl),
  xxxl: scale(spacing.xxxl),
} as const;

/**
 * Moderate responsive spacing scale
 *
 * Uses `moderateScale()` for gentler scaling.
 * Recommended for smaller UI elements where aggressive scaling is unpleasant.
 */
export const moderateSpacing = {
  none: 0,
  xs: moderateScale(spacing.xs),
  sm: moderateScale(spacing.sm),
  md: moderateScale(spacing.md),
  lg: moderateScale(spacing.lg),
  xl: moderateScale(spacing.xl),
  xxl: moderateScale(spacing.xxl),
  xxxl: moderateScale(spacing.xxxl),
} as const;

// =============================================================================
// RESPONSIVE GAP
// =============================================================================

/**
 * Responsive gap scale
 *
 * Uses `scale()` for consistent internal spacing.
 */
export const responsiveGap = {
  none: 0,
  xs: scale(gap.xs),
  sm: scale(gap.sm),
  md: scale(gap.md),
  lg: scale(gap.lg),
  xl: scale(gap.xl),
  xxl: scale(gap.xxl),
} as const;

// =============================================================================
// RESPONSIVE TYPOGRAPHY
// =============================================================================

/**
 * Responsive font sizes
 *
 * Uses `normalizeFont()` to scale fonts appropriately while
 * respecting min/max bounds for accessibility.
 */
export const responsiveFontSizes = createResponsiveFontSizes(typography.sizes);

/**
 * Complete responsive typography configuration
 *
 * Combines responsive font sizes with the existing typography settings.
 */
export const responsiveTypography = {
  ...typography,
  sizes: responsiveFontSizes,
} as const;

// =============================================================================
// RESPONSIVE LINE HEIGHTS
// =============================================================================

/**
 * Responsive line heights based on font sizes
 *
 * Calculated as 1.5x the font size for optimal readability.
 */
export const responsiveLineHeights = {
  xs: normalizeFont(typography.sizes.xs) * 1.5,
  sm: normalizeFont(typography.sizes.sm) * 1.5,
  md: normalizeFont(typography.sizes.md) * 1.5,
  lg: normalizeFont(typography.sizes.lg) * 1.5,
  xl: normalizeFont(typography.sizes.xl) * 1.5,
  xxl: normalizeFont(typography.sizes.xxl) * 1.4,
  xxxl: normalizeFont(typography.sizes.xxxl) * 1.3,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ResponsiveSpacing = typeof responsiveSpacing;
export type ModerateSpacing = typeof moderateSpacing;
export type ResponsiveGap = typeof responsiveGap;
export type ResponsiveFontSizes = typeof responsiveFontSizes;
export type ResponsiveTypography = typeof responsiveTypography;
export type ResponsiveLineHeights = typeof responsiveLineHeights;
