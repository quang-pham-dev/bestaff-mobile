import { useMemo } from 'react';

import { Theme } from '@bestaff/theme';

import { useTheme } from './use-theme';

export type VariantFunction<T> = (theme: Theme) => T;
export type Variants<T> = {
  [key: string]: VariantFunction<T>;
};

/**
 * Hook to select a value based on a variant key.
 *
 * @template T The type of the returned value.
 * @param {Variants<T>} variants An object containing variant functions.
 * @param {keyof typeof variants} variant The key of the variant to select.
 * @returns {T} The value returned by the selected variant function.
 *
 * @example
 * ```tsx
 * const buttonStyle = useThemeVariant({
 *   primary: theme => ({ backgroundColor: theme.colors.primary }),
 *   secondary: theme => ({ backgroundColor: theme.colors.secondary }),
 * }, 'primary');
 * ```
 */
export function useThemeVariant<T>(
  variants: Variants<T>,
  variant: keyof typeof variants,
): T {
  const { theme } = useTheme();

  return useMemo(() => {
    const variantFn = variants[variant];
    if (!variantFn) {
      throw new Error(`No variant function found for key: ${variant}`);
    }
    return variantFn(theme);
  }, [variant, variants, theme]);
}
