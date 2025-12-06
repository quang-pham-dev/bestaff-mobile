import { type Theme, createStyles } from '@bestaff/theme';

export const useCheckboxStyles = createStyles((theme: Theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.sm,
  },
  disabled: {
    opacity: 0.5,
  },
}));
