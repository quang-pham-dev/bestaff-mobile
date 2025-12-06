import { StyleSheet } from 'react-native';

import { Theme, createStyles } from '@bestaff/theme';

export const useVideoPlayerStyles = createStyles((theme: Theme) => ({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.sm,
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.surface,
    borderRadius: 1.5,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 1.5,
  },
  timeText: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
}));
