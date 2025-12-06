import { type ImageSourcePropType } from 'react-native';

import { useTheme } from '@bestaff/hooks';

import { Box } from '@/components/common/Box';
import { Button } from '@/components/common/Button';
import { Image } from '@/components/common/Image/Image';
import { Typography } from '@/components/common/Typography/Typography';

import { useErrorScreenStyles } from './ErrorScreen.styles';

interface ErrorScreenProps {
  /**
   * Error message to display
   * @default 'Something went wrong'
   */
  message?: string;
  /**
   * Callback function when retry button is pressed
   */
  onRetry?: () => void;
  /**
   * Custom image source for error illustration
   */
  imageSource?: ImageSourcePropType;
}

export function ErrorScreen({
  message = 'Something went wrong',
  onRetry,
  imageSource,
}: ErrorScreenProps) {
  const { theme } = useTheme();
  const styles = useErrorScreenStyles(theme);

  return (
    <Box style={styles.container}>
      {!!imageSource && (
        <Box style={styles.iconContainer}>
          <Image
            source={imageSource}
            style={styles.image}
            contentFit="contain"
          />
        </Box>
      )}

      <Typography variant="h3" style={styles.title}>
        Oops!
      </Typography>

      <Typography variant="body1" style={styles.message}>
        {message}
      </Typography>

      {onRetry && (
        <Button variant="primary" onPress={onRetry}>
          <Typography variant="title">Try Again</Typography>
        </Button>
      )}
    </Box>
  );
}
