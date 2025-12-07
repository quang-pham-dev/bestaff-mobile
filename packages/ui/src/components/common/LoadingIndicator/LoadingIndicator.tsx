import { JSX } from 'react';
import {
  ActivityIndicator,
  type ActivityIndicatorProps,
  type StyleProp,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@bestaff/hooks';

import { ThemedText } from '@/components/common/ThemedText';

import { useLoadingIndicatorStyles } from './LoadingIndicator.styles';

/**
 * Available variants for the LoadingIndicator
 */
type LoadingVariant = 'primary' | 'secondary';

/**
 * Props for the LoadingIndicator component
 * Extends ActivityIndicator props excluding color (handled by variant)
 */
export interface LoadingIndicatorProps extends Omit<
  ActivityIndicatorProps,
  'color'
> {
  /**
   * Text to display below the loading indicator
   * @example "Loading..."
   */
  text?: string;

  /**
   * The variant of the loading indicator
   * @default 'primary'
   */
  variant?: LoadingVariant;

  /**
   * If true, shows the loading indicator in a centered overlay
   * @default false
   */
  overlay?: boolean;

  /**
   * Size of the indicator.
   * Small has a height of 20, large has a height of 36.
   *
   * enum('small', 'large')
   */
  size?: number | 'small' | 'large' | undefined;

  /**
   * Style for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * LoadingIndicator Component
 *
 * A themed loading indicator component with optional text and overlay support.
 *
 * @example
 * ```tsx
 * Basic usage
 * <LoadingIndicator />
 *
 * With text
 * <LoadingIndicator
 *   text="Loading data..."
 *   variant="secondary"
 * />
 *
 * As overlay
 * <LoadingIndicator
 *   overlay
 *   text="Please wait"
 *   size="large"
 * />
 * ```
 */
export function LoadingIndicator({
  text,
  variant = 'primary',
  overlay = false,
  style,
  size,
  containerStyle,
  ...props
}: LoadingIndicatorProps): JSX.Element {
  const { theme } = useTheme();
  const styles = useLoadingIndicatorStyles(theme);

  /**
   * Gets the appropriate color based on variant
   */
  const getColor = (): string => {
    switch (variant) {
      case 'secondary':
        return theme.colors.textSecondary;
      default:
        return theme.colors.primary;
    }
  };

  /**
   * Renders the main loading content
   */
  const renderContent = () => (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={getColor()} {...props} />
      {text && (
        <ThemedText
          style={[styles.text, { color: getColor() }, style as TextStyle]}
          numberOfLines={2}
        >
          {text}
        </ThemedText>
      )}
    </View>
  );

  if (overlay) {
    return (
      <View
        style={styles.overlay}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={text || 'Loading'}
      >
        <View
          style={[
            styles.overlayContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {renderContent()}
        </View>
      </View>
    );
  }

  return renderContent();
}
