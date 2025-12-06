import { JSX, memo } from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { type Href, Link } from 'expo-router';

import { useTheme } from '@bestaff/hooks';
import type { Theme } from '@bestaff/theme';

import {
  Typography,
  type TypographyProps,
} from '@/components/common/Typography/Typography';

import { useTextLinkStyles } from './TextLink.styles';

interface TextLinkProps extends Omit<PressableProps, 'style'> {
  /**
   * The text content to be displayed
   */
  children: string;
  /**
   * Optional color from theme
   * @default 'primary'
   */
  color?: keyof Theme['colors'];
  /**
   * Optional variant for text styling
   * @default 'body2'
   */
  variant?: TypographyProps['variant'];
  /**
   * Optional font weight
   * @default 'medium'
   */
  weight?: TypographyProps['weight'];
  /**
   * Whether to underline the text
   * @default false
   */
  underline?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Custom typography props
   */
  textProps?: Omit<TypographyProps, 'variant' | 'color' | 'weight'>;
  /**
   * Optional href for navigation
   * If provided, will use Link component
   */
  href?: Href;
}

export const TextLink = memo(
  ({
    onPress,
    children,
    href,
    color = 'primary',
    variant = 'body2',
    weight = 'medium',
    underline = false,
    disabled = false,
    textProps,
    ...pressableProps
  }: TextLinkProps): JSX.Element => {
    const { theme } = useTheme();
    const styles = useTextLinkStyles(theme);

    if (href) {
      return (
        <Link href={href} asChild>
          <Pressable>
            <Typography
              variant={variant}
              color={color}
              weight={weight}
              style={[
                underline ? styles.underline : styles.none,
                disabled ? styles.disabled : {},
              ]}
            >
              {children}
            </Typography>
          </Pressable>
        </Link>
      );
    }

    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="link"
        accessibilityState={{ disabled }}
        {...pressableProps}
      >
        {({ pressed }) => (
          <Typography
            variant={variant}
            color={color}
            weight={weight}
            style={[
              underline ? styles.underline : styles.none,
              disabled ? styles.disabled : {},
              pressed && { opacity: 0.7 },
            ]}
            {...textProps}
          >
            {children}
          </Typography>
        )}
      </Pressable>
    );
  },
);

TextLink.displayName = 'TextLink';
