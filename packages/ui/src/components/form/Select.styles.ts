import { type Theme, createStyles } from '@bestaff/theme';

/**
 * Select component styles factory
 */
export const useSelectStyles = (maxHeight: number) =>
  createStyles((theme: Theme) => ({
    container: {
      width: '100%',
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
    },
    triggerText: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    modal: {
      margin: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
    },
    optionsList: {
      paddingVertical: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.sm,
    },
    optionIcon: {
      marginRight: theme.spacing.sm,
    },
    selectedOption: {
      backgroundColor: theme.colors.surfaceHover,
    },
    disabled: {
      opacity: 0.5,
    },
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
    },
    scrollView: {
      maxHeight,
    },
  }));
