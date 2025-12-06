import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@bestaff/hooks';
import { Ionicons } from '@expo/vector-icons';

import { useIconCircleButtonStyles } from './IconCircleButton.styles';

type ButtonStyle = ViewStyle | StyleProp<ViewStyle>;

interface IconCircleButtonProps {
  /**
   * The name icon of @expo/vector-icons
   * @default undefined
   */
  name?: React.ComponentProps<typeof Ionicons>['name'];
  /**
   * The disabled state of the button
   * @default false
   */
  disabled?: boolean;
  /**
   * The style of the button
   * @default undefined
   */
  style?: ButtonStyle;
  /**
   * The action to perform when the button is pressed
   * @returns void
   */
  onPress?: () => void;
  /**
   * Rotation angle in degrees
   * @default 0
   */
  rotate?: number;
  /**
   * The icon to display inside the button
   */
  children?: ReactNode;
}

export function IconCircleButton({
  name,
  disabled = false,
  style,
  children,
  rotate = 0,
  onPress,
  ...props
}: IconCircleButtonProps) {
  const { theme } = useTheme();
  const styles = useIconCircleButtonStyles(theme);

  const getButtonStyle = ({
    pressed,
  }: PressableStateCallbackType): ButtonStyle[] =>
    [
      styles.container,
      disabled && styles.disabled,
      {
        opacity: pressed ? 0.6 : 1,
        transform: [{ rotate: `${rotate}deg` }],
      },
      style as ViewStyle,
    ].filter(Boolean);

  return (
    <Pressable
      hitSlop={{
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      }}
      onPress={onPress}
      {...props}
      style={getButtonStyle}
    >
      {children || <Ionicons name={name} size={25} color={theme.colors.text} />}
    </Pressable>
  );
}
