import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useTheme, useThemeVariant } from '@bestaff/hooks';

import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ThemedText } from '@/components/common/ThemedText';

import {
  buttonSizeStyles,
  buttonTextVariantStyles,
  buttonVariantStyles,
  useButtonStyles,
} from './Button.styles';

/**
 * Available visual variants for the Button component
 * @typedef {'primary' | 'secondary' | 'outline' | 'ghost'} ButtonVariant
 * @description
 * - primary: Main call-to-action button with brand color
 * - secondary: Alternative button style with surface color
 * - outline: Bordered button with transparent background
 * - ghost: Text-only button without background or border
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

/**
 * Predefined size options for the Button component
 * @typedef {'small' | 'medium' | 'large'} ButtonSize
 * @description
 * - small: Compact button for tight spaces (padding: sm, fontSize: 14)
 * - medium: Standard button size (padding: md, fontSize: 16)
 * - large: Prominent button size (padding: lg, fontSize: 18)
 */
type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Type definition for button style array
 * Combines ViewStyle and StyleProp for flexible style application
 * @typedef {ViewStyle | StyleProp<ViewStyle>} ButtonStyle
 */
type ButtonStyle = ViewStyle | StyleProp<ViewStyle>;

export type BaseButtonProps = {
  /**
   * The title of the button
   * @default undefined
   */
  title?: string;
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * If true, the button will show a loading spinner
   * @default false
   */
  loading?: boolean;
  /**
   * Text style of the button
   * @default undefined
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Container style for the image wrapper
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Children of the button
   * @default undefined
   */
  children?: ReactNode;
} & Omit<PressableProps, 'children'>;

export type TitleButtonProps = BaseButtonProps & {
  title: string;
  children?: never;
};

export type ChildrenButtonProps = BaseButtonProps & {
  title?: never;
  children: ReactNode;
};

export type ButtonProps = TitleButtonProps | ChildrenButtonProps;

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled,
  style,
  textStyle,
  children,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const buttonStyle = useThemeVariant(buttonVariantStyles, variant);
  const textStyleVariant = useThemeVariant(buttonTextVariantStyles, variant);
  const sizeStyle = useThemeVariant(buttonSizeStyles, size);

  const styles = useButtonStyles(theme);

  const getButtonStyle = ({
    pressed,
  }: PressableStateCallbackType): ButtonStyle[] =>
    [
      styles.button,
      buttonStyle,
      sizeStyle,
      disabled && styles.disabled,
      { opacity: pressed ? 0.8 : 1 },
      style as ViewStyle,
    ].filter(Boolean);

  const content = title || children;

  return (
    <Pressable
      disabled={disabled || loading}
      style={getButtonStyle}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      {loading ? (
        <LoadingIndicator variant="primary" />
      ) : (
        <ThemedText
          style={[
            styles.text,
            textStyleVariant,
            { fontSize: sizeStyle.fontSize },
            disabled && styles.disabledText,
            textStyle,
          ].filter(Boolean)}
        >
          {content}
        </ThemedText>
      )}
    </Pressable>
  );
}
