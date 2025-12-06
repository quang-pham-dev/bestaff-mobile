import { JSX, type ReactNode, useState } from 'react';
import {
  type ImageSourcePropType,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from 'expo-image';

import { useTheme } from '@bestaff/hooks';

import { LoadingIndicator } from '@/components/common/LoadingIndicator';
import { ThemedText } from '@/components/common/ThemedText';

import { useImageStyles } from './Image.styles';

/**
 * Props for the Image component
 * Extends React Native's ImageProps with additional functionality
 */
export interface ImageProps extends Omit<ExpoImageProps, 'source' | 'style'> {
  /**
   * The source URL or require() for the image
   * @example
   * URL source
   * source="https://example.com/image.jpg"
   * Local image
   * source={require('./image.jpg')}
   */
  source: string | ImageSourcePropType;

  /**
   * Aspect ratio of the image (width/height)
   * @example
   * Square image
   * aspectRatio={1}
   * 16:9 image
   * aspectRatio={16/9}
   */
  aspectRatio?: number;

  /**
   * If true, shows a loading indicator while the image is loading
   * @default true
   */
  showLoadingIndicator?: boolean;

  /**
   * Text to display when the image fails to load
   * @default "Failed to load image"
   */
  fallbackText?: string;

  /**
   * Custom loading component to show while image is loading
   * @example
   * loadingComponent={<CustomSpinner />}
   */
  loadingComponent?: ReactNode;

  /**
   * Custom error component to show when image fails to load
   * @example
   * errorComponent={<CustomError message="Failed" />}
   */
  errorComponent?: ReactNode;

  /**
   * Container style for the image wrapper
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Image Component
 *
 * A themed image component with loading and error states.
 * Supports both remote and local images with various display options.
 *
 * @example
 * ```tsx
 * Basic usage with URL
 * <Image source="https://example.com/image.jpg" />
 *
 * Local image with aspect ratio
 * <Image
 *   source={require('./image.jpg')}
 *   aspectRatio={16/9}
 * />
 *
 * With custom error handling
 * <Image
 *   source="invalid-url"
 *   fallbackText="Custom error message"
 *   errorComponent={<CustomError />}
 * />
 * ```
 */
export function Image({
  source,
  aspectRatio,
  showLoadingIndicator = true,
  fallbackText = 'Failed to load image',
  loadingComponent,
  errorComponent,
  style,
  ...props
}: ImageProps): JSX.Element {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const styles = useImageStyles(theme);

  // Add proper loading and error handlers
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  /**
   * Handles successful image load
   */
  const handleLoadSuccess = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  /**
   * Converts source prop to proper image source type
   */
  const imageSource: ImageSourcePropType =
    typeof source === 'string' ? { uri: source } : source;

  return (
    <View
      style={[
        styles.container,
        aspectRatio !== undefined && { aspectRatio },
        style,
      ]}
    >
      <ExpoImage
        source={imageSource}
        onLoadStart={handleLoadStart}
        onLoad={handleLoadSuccess}
        onError={handleError}
        style={styles.image}
        contentFit="cover" // Default content fit override if needed
        cachePolicy="memory-disk" // Add caching policy
        {...(props as ExpoImageProps)}
      />

      {isLoading && showLoadingIndicator && (
        <View style={styles.overlay}>
          {loadingComponent || (
            <LoadingIndicator variant="primary" size="small" />
          )}
        </View>
      )}

      {hasError && (
        <View style={styles.overlay}>
          {errorComponent || (
            <ThemedText style={styles.errorText}>{fallbackText}</ThemedText>
          )}
        </View>
      )}
    </View>
  );
}
