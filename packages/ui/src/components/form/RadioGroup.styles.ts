import { type Theme, createStyles } from '@bestaff/theme';

export const useRadioGroupStyles = createStyles((theme: Theme) => ({
  container: {
    width: '100%',
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  vertical: {
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 999,
  },
  innerCircle: {
    borderRadius: 999,
  },
  label: {
    marginLeft: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
}));
