import { type Theme, createStyles } from '@bestaff/theme';

export const useSwitchStyles = createStyles((theme: Theme) => ({
  track: {
    borderRadius: 999,
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: 999,
    backgroundColor: theme.colors.surface,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: 'absolute',
  },
  disabled: {
    opacity: 0.5,
  },
}));
