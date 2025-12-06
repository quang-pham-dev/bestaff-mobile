import { type Theme, createStyles } from '@bestaff/theme';

export const useFormFieldStyles = createStyles((theme: Theme) => ({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xs,
  },
  inputWrapper: {
    marginBottom: theme.spacing.xs,
  },
  helperText: {
    marginTop: theme.spacing.xs,
  },
  error: {
    color: theme.colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
}));
