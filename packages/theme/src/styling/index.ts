/**
 * Styling utilities for creating theme-aware styles outside components
 *
 * @module @bestaff/theme/styling
 */

export { createStyles, getStyleCacheStats } from './createStyles';
export { mergeStyles, conditionalStyle } from './compose';
export type {
  StyleObject,
  StyleFactory,
  StyleCreator,
  BaseStyle,
} from './types';
