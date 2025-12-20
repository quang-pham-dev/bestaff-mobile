/**
 * Responsive Types
 *
 * Type definitions for the responsive utility system.
 */

// =============================================================================
// BREAKPOINT TYPES
// =============================================================================

/** Available breakpoint keys */
export type BreakpointKey = 'small' | 'baseline' | 'large' | 'tablet';

/** Breakpoint status object */
export type Breakpoints = {
  [K in BreakpointKey]: boolean;
};

/** Responsive value map for different breakpoints */
export type ResponsiveValue<T> = {
  small?: T;
  baseline?: T;
  large?: T;
  tablet?: T;
  default: T;
};

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

/** Screen orientation */
export type Orientation = 'portrait' | 'landscape';

/** Complete responsive configuration */
export interface ResponsiveConfig {
  /** Current screen width */
  width: number;
  /** Current screen height */
  height: number;
  /** Breakpoint status flags */
  breakpoints: Breakpoints;
  /** Current orientation */
  orientation: Orientation;
  /** Device pixel ratio */
  pixelRatio: number;
}

// =============================================================================
// FUNCTION TYPES
// =============================================================================

/** Standard scale function signature */
export type ScaleFunction = (size: number) => number;

/** Moderate scale function with optional factor */
export type ModerateScaleFunction = (size: number, factor?: number) => number;

/** Font normalization function with optional constraints */
export type NormalizeFontFunction = (
  size: number,
  factor?: number,
  minSize?: number,
  maxSize?: number,
) => number;

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/** Return type for useScaling hook */
export interface ScalingUtils {
  scale: ScaleFunction;
  verticalScale: ScaleFunction;
  moderateScale: ModerateScaleFunction;
  moderateVerticalScale: ModerateScaleFunction;
  normalizeFont: NormalizeFontFunction;
}
