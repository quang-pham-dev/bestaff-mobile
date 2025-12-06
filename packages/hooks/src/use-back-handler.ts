import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Hook to handle hardware back button press on Android.
 *
 * @param {() => boolean | null | undefined} onBackButtonPress Callback function to handle back button press. Return true to prevent default behavior (exit app).
 *
 * @example
 * ```tsx
 * useBackHandler(() => {
 *   if (shouldPreventBack) {
 *     return true;
 *   }
 *   return false;
 * });
 * ```
 */
export function useBackHandler(
  onBackButtonPress: () => boolean | null | undefined,
) {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackButtonPress,
    );

    return () => {
      subscription.remove();
    };
  }, [onBackButtonPress]);
}
