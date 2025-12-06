import { StyleSheet } from 'react-native';

import { type Theme, createStyles } from '@bestaff/theme';

export const useImageStyles = createStyles((theme: Theme) => ({
  container: {
    overflow: 'hidden',
    backgroundColor: theme.colors.transparent,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceHover,
  },
  errorText: {
    textAlign: 'center',
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
}));
