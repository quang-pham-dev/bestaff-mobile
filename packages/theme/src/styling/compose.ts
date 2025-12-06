import type { StyleObject } from './types';

/**
 * Merges multiple style objects into a single object
 * Later styles override earlier ones for conflicting properties
 *
 * @param styles - Variable number of style objects to merge
 * @returns Merged style object
 *
 * @example
 * ```tsx
 * const baseStyles = { padding: 10, backgroundColor: 'red' };
 * const variantStyles = { backgroundColor: 'blue' };
 * const merged = mergeStyles(baseStyles, variantStyles);
 * // Result: { padding: 10, backgroundColor: 'blue' }
 * ```
 */
export function mergeStyles<T extends StyleObject>(...styles: Partial<T>[]): T {
  return Object.assign({}, ...styles) as T;
}

/**
 * Conditionally applies styles based on boolean flags
 *
 * @param baseStyle - Base style always applied
 * @param conditionalStyles - Array of [condition, style] tuples
 * @returns Merged style object with conditionally applied styles
 *
 * @example
 * ```tsx
 * const style = conditionalStyle(
 *   { padding: 10 },
 *   [isPressed, { opacity: 0.8 }],
 *   [isDisabled, { backgroundColor: 'gray' }],
 * );
 * ```
 */
export function conditionalStyle(
  baseStyle: StyleObject,
  ...conditionalStyles: Array<[boolean, StyleObject]>
): StyleObject {
  const applicableStyles = conditionalStyles
    .filter(([condition]) => condition)
    .map(([, style]) => style);

  return mergeStyles(baseStyle, ...applicableStyles);
}
