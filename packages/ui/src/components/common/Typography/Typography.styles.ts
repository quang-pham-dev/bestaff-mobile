import { type Theme, createStyles, normalizeFont } from '@bestaff/theme';

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
    fontSize: normalizeFont(theme.typography.sizes.xxxl, 0.4),
    fontWeight: theme.typography.weights.bold,
    lineHeight: normalizeFont(theme.typography.sizes.xxxl, 0.4) * 1.2,
  },
  h2: {
    fontSize: normalizeFont(theme.typography.sizes.xxl, 0.4),
    fontWeight: theme.typography.weights.bold,
    lineHeight: normalizeFont(theme.typography.sizes.xxl, 0.4) * 1.2,
  },
  h3: {
    fontSize: normalizeFont(theme.typography.sizes.xl, 0.4),
    fontWeight: theme.typography.weights.semibold,
    lineHeight: normalizeFont(theme.typography.sizes.xl, 0.4) * 1.2,
  },
  h4: {
    fontSize: normalizeFont(theme.typography.sizes.lg, 0.4),
    fontWeight: theme.typography.weights.semibold,
    lineHeight: normalizeFont(theme.typography.sizes.lg, 0.4) * 1.2,
  },
  title: {
    fontSize: normalizeFont(theme.typography.sizes.lg),
    fontWeight: theme.typography.weights.bold,
    lineHeight: normalizeFont(theme.typography.sizes.md) * 1.5,
  },
  subtitle: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
    lineHeight: normalizeFont(theme.typography.sizes.md) * 1.5,
  },
  subtitle1: {
    fontSize: normalizeFont(theme.typography.sizes.sm),
    fontWeight: theme.typography.weights.medium,
    lineHeight: normalizeFont(theme.typography.sizes.sm) * 1.5,
  },
  body1: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    lineHeight: normalizeFont(theme.typography.sizes.md) * 1.5,
  },
  body2: {
    fontSize: normalizeFont(theme.typography.sizes.sm),
    lineHeight: normalizeFont(theme.typography.sizes.sm) * 1.5,
  },
  caption: {
    fontSize: normalizeFont(theme.typography.sizes.xs, 0.6),
    lineHeight: normalizeFont(theme.typography.sizes.xs, 0.6) * 1.5,
  },
  overline: {
    fontSize: normalizeFont(theme.typography.sizes.xs),
    fontWeight: theme.typography.weights.medium,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  link: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
  },
  error: {
    fontSize: normalizeFont(theme.typography.sizes.md),
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.error,
    lineHeight: normalizeFont(theme.typography.sizes.sm) * 1.5,
  },
}));
