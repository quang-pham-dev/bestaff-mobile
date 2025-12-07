import { useContext } from 'react';

import { ThemeStylesContext } from './theme-styles-context';

/**
 * Hook to access the current theme styles.
 *
 * @returns The current theme styles object.
 * @throws {Error} If used outside of a ThemeStylesProvider.
 *
 * @example
 * ```tsx
 * const styles = useThemeStyles();
 * return <View style={styles.container} />;
 * ```
 */
export const useThemeStyles = () => {
  const themeStylesContext = useContext(ThemeStylesContext);
  if (!themeStylesContext) {
    throw new Error('useThemeStyles must be used within a ThemeStylesProvider');
  }
  return themeStylesContext.styles;
};
