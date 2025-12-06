import { type PropsWithChildren, createContext, useMemo } from 'react';

import { type ThemeStyles, styles } from '@bestaff/theme';
import {
  type StyleUtilsType,
  createStyleUtils,
} from '@bestaff/utils/create-styles';

import { useTheme } from './useTheme';

export interface ThemeStylesContextType {
  styles: ThemeStyles;
  StyleUtils: StyleUtilsType;
}

export const ThemeStylesContext = createContext<
  ThemeStylesContextType | undefined
>(undefined);

type ThemeStylesProviderProps = PropsWithChildren;

function ThemeStylesProvider({ children }: ThemeStylesProviderProps) {
  const { theme } = useTheme();

  const themeStyles = useMemo(() => styles(theme), [theme]);
  const StyleUtils = useMemo(
    () => createStyleUtils(theme, themeStyles),
    [theme, themeStyles],
  );
  const contextValue = useMemo(
    () => ({ styles: themeStyles, StyleUtils }),
    [themeStyles, StyleUtils],
  );

  return (
    <ThemeStylesContext.Provider value={contextValue}>
      {children}
    </ThemeStylesContext.Provider>
  );
}

ThemeStylesProvider.displayName = 'ThemeStylesProvider';

export default ThemeStylesProvider;
