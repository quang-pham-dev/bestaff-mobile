import { useMemo } from 'react';

import { Theme } from '@bestaff/theme';

import { useTheme } from './useTheme';

/**
 * Hook to select a specific value from the theme.
 *
 * @template T The type of the selected value.
 * @param {function(Theme): T} selector A function that takes the theme and returns a value.
 * @returns {T} The selected value from the theme.
 *
 * @example
 * ```tsx
 * const primaryColor = useThemeValue(theme => theme.colors.primary);
 * ```
 */
export const useThemeValue = <T>(selector: (theme: Theme) => T): T => {
  const { theme } = useTheme();
  return useMemo(() => selector(theme), [selector, theme]);
};
