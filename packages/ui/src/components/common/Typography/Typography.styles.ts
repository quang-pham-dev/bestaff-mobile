import { type Theme, createStyles } from '@bestaff/theme';

export const useWeightStyles = createStyles((theme: Theme) => ({
  regular: {
    fontWeight: theme.typography.weights.regular,
  },
  medium: {
    fontWeight: theme.typography.weights.medium,
  },
  semibold: {
    fontWeight: theme.typography.weights.semibold,
  },
  bold: {
    fontWeight: theme.typography.weights.bold,
  },
}));

export const useTypographyStyles = createStyles((theme: Theme) => ({
  base: {
    color: theme.colors.text,
  },
  h1: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.sizes.xxxl * 1.2,
  },
  h2: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.sizes.xxl * 1.2,
  },
  h3: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    lineHeight: theme.typography.sizes.xl * 1.2,
  },
  h4: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    lineHeight: theme.typography.sizes.lg * 1.2,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    lineHeight: theme.typography.sizes.md * 1.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.sizes.md * 1.5,
  },
  subtitle1: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    lineHeight: theme.typography.sizes.sm * 1.5,
  },
  body1: {
    fontSize: theme.typography.sizes.md,
    lineHeight: theme.typography.sizes.md * 1.5,
  },
  body2: {
    fontSize: theme.typography.sizes.sm,
    lineHeight: theme.typography.sizes.sm * 1.5,
  },
  caption: {
    fontSize: theme.typography.sizes.xs,
    lineHeight: theme.typography.sizes.xs * 1.5,
  },
  overline: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  link: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  error: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
    lineHeight: theme.typography.sizes.sm * 1.5,
  },
}));
