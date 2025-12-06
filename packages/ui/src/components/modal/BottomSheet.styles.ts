import { Theme, createStyles } from '@bestaff/theme';

export const useBottomSheetStyles = createStyles((theme: Theme) => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  handle: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  backdrop: {
    backgroundColor: theme.colors.overlay,
  },
}));
