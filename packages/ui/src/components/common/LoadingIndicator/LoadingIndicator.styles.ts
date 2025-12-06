import { type Theme, createStyles } from '@bestaff/theme';

export const useLoadingIndicatorStyles = createStyles((theme: Theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.sizes.sm,
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.overlay,
  },
  overlayContent: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
