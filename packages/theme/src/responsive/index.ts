/**
 * @bestaff/theme/responsive
 *
 * Production-ready responsive utilities for React Native.
 *
 * @example Static scaling (for StyleSheet)
 * ```ts
 * import { scale, moderateScale, normalizeFont } from '@bestaff/theme/responsive';
 *
 * const styles = StyleSheet.create({
 *   container: { padding: scale(16) },
 *   title: { fontSize: normalizeFont(24) },
 * });
 * ```
 *
 * @example Dynamic scaling (for components)
 * ```tsx
 * import { useResponsive, useResponsiveValue } from '@bestaff/theme/responsive';
 *
 * function MyComponent() {
 *   const { breakpoints } = useResponsive();
 *   const columns = useResponsiveValue({ small: 1, tablet: 3, default: 2 });
 *   // ...
 * }
 * ```
 */

// Constants
export * from './constants';

// Types
export * from './types';

// Core utilities (static)
export * from './scaling';
export * from './breakpoints';
export * from './font';

// Hooks (dynamic)
export * from './hooks';
