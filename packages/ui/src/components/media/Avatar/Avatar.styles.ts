import { type Theme, createStyles } from '@bestaff/theme';

export const useAvatarStyles = createStyles((theme: Theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
