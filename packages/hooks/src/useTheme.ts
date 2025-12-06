import { useContext } from 'react';

import { ThemeContext } from './ThemeContext';

/**
 * Hook to access the current theme context.
 *
 * @returns The current theme context containing theme object, dark mode state, and toggle functions.
 * @throws {Error} If used outside of a ThemeProvider.
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme } = useTheme();
 * console.log(theme.colors.primary);
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
