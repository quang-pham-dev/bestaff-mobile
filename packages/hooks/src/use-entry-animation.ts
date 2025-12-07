import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface EntryAnimationConfig {
  delay?: number;
  duration?: number;
  type?: 'slide' | 'fade' | 'both';
}

/**
 * Hook to create entry animations for components.
 *
 * @param {EntryAnimationConfig} config Configuration object.
 * @param {number} [config.delay=0] Delay before animation starts in ms.
 * @param {number} [config.duration=500] Duration of the animation in ms.
 * @param {'slide' | 'fade' | 'both'} [config.type='both'] Type of animation.
 * @returns {import('react-native-reanimated').AnimatedStyleProp<import('react-native').ViewStyle>} Animated style object.
 *
 * @example
 * ```tsx
 * const animatedStyle = useEntryAnimation({ delay: 100, type: 'fade' });
 * return <Animated.View style={animatedStyle} />;
 * ```
 */
export function useEntryAnimation({
  delay = 0,
  duration = 500,
  type = 'both',
}: EntryAnimationConfig = {}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      }),
    );
  }, [delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    if (type === 'fade') {
      return {
        opacity: opacity.value,
      };
    }

    if (type === 'slide') {
      return {
        transform: [{ translateY: translateY.value }],
      };
    }

    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return animatedStyle;
}
