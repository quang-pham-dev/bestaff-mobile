import { type Theme, createStyles } from '@bestaff/theme';

/**
 * Input component styles factory
 */
export const useInputStyles = createStyles((theme: Theme) => ({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    minHeight: 44,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.md,
    paddingVertical: theme.spacing.sm,
  },
  icon: {
    paddingHorizontal: theme.spacing.sm,
  },
  helperText: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.sizes.xs,
  },
  disabled: {
    opacity: 0.6,
  },
}));
