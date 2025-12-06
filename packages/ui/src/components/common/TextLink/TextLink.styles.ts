import { type Theme, createStyles } from '@bestaff/theme';

export const useTextLinkStyles = createStyles((theme: Theme) => ({
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'none',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  none: {
    textDecorationLine: 'none',
  },
  disabled: {
    opacity: 0.5,
  },
}));
