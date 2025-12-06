import { type Theme, createStyles } from '@bestaff/theme';

export const useBoxStyles = createStyles((theme: Theme) => ({
  base: {
    backgroundColor: theme.colors.surface,
  },
}));
