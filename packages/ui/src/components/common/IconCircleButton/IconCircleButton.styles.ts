import { type Theme, createStyles } from '@bestaff/theme';

export const useIconCircleButtonStyles = createStyles((theme: Theme) => ({
  container: {
    width: 45,
    height: 45,
    padding: 10,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: theme.colors.primaryDisabled,
    borderColor: theme.colors.border,
  },
}));
