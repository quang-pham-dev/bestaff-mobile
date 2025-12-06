import type { TextStyle, ViewStyle } from 'react-native';

import { type Theme, createStyles } from '@bestaff/theme';

/**
 * Button variant styles configuration
 * Defines the visual appearance for different button states
 */
export const buttonVariantStyles = {
  primary: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.primary,
    borderColor: 'transparent',
    borderWidth: 0,
  }),
  secondary: (theme: Theme): ViewStyle => ({
    backgroundColor: theme.colors.surface,
    borderColor: 'transparent',
    borderWidth: 0,
  }),
  outline: (theme: Theme): ViewStyle => ({
    backgroundColor: 'transparent',
    borderColor: theme.colors.border,
    borderWidth: 1,
  }),
  ghost: (): ViewStyle => ({
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  }),
};

/**
 * Text variant styles for different button types
 */
export const buttonTextVariantStyles = {
  primary: (theme: Theme): TextStyle => ({
    color: theme.colors.textInverse,
  }),
  secondary: (theme: Theme): TextStyle => ({
    color: theme.colors.text,
  }),
  outline: (theme: Theme): TextStyle => ({
    color: theme.colors.text,
  }),
  ghost: (theme: Theme): TextStyle => ({
    color: theme.colors.text,
  }),
};

/**
 * Size variant configuration
 */
export const buttonSizeStyles = {
  small: (theme: Theme): { padding: number; fontSize: number } => ({
    padding: theme.spacing.sm,
    fontSize: 14,
  }),
  medium: (theme: Theme): { padding: number; fontSize: number } => ({
    padding: theme.spacing.md,
    fontSize: 16,
  }),
  large: (theme: Theme): { padding: number; fontSize: number } => ({
    padding: theme.spacing.lg,
    fontSize: 18,
  }),
};

/**
 * Base button styles factory
 * These styles are common across all button variants
 */
export const useButtonStyles = createStyles((theme: Theme) => ({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  text: {
    fontWeight: theme.typography.weights.semibold,
  },
  disabled: {
    backgroundColor: theme.colors.primaryDisabled,
    borderColor: theme.colors.border,
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
}));
