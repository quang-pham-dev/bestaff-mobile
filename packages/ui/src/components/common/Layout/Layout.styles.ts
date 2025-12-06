import { Theme } from '@bestaff/theme';

interface LayoutStyleParams {
  backgroundColor?: string;
  safeAreaTop?: number;
  safeAreaBottom?: number;
  centerContent?: boolean;
  ignoreSafeArea?: boolean;
}

/**
 * Plain style factory for Layout components
 * Note: Not using createStyles cache because styles depend on many dynamic runtime values
 */
export const createMainLayoutStyles = (
  theme: Theme,
  params: LayoutStyleParams,
) => ({
  container: {
    flex: 1,
    backgroundColor: params.backgroundColor || theme.colors.background,
    paddingTop: params.safeAreaTop,
    paddingBottom: params.safeAreaBottom,
    ...(params.centerContent && {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    }),
  },
  content: {
    flexGrow: 1,
  },
});

export const createKeyboardAvoidingViewStyles = (
  theme: Theme,
  params: LayoutStyleParams,
) => ({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: params.safeAreaBottom,
  },
});
