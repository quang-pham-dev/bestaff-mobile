import {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  notificationAsync,
  selectionAsync,
} from 'expo-haptics';

/**
 * Hook to provide haptic feedback functions.
 *
 * @returns An object containing functions for different types of haptic feedback.
 *
 * @example
 * ```tsx
 * const { lightImpact, success } = useHaptics();
 *
 * const onPress = () => {
 *   lightImpact();
 *   // ...
 *   success();
 * };
 * ```
 */
export const useHaptics = () => {
  const lightImpact = () => impactAsync(ImpactFeedbackStyle.Light);
  const mediumImpact = () => impactAsync(ImpactFeedbackStyle.Medium);
  const heavyImpact = () => impactAsync(ImpactFeedbackStyle.Heavy);

  const success = () => notificationAsync(NotificationFeedbackType.Success);
  const warning = () => notificationAsync(NotificationFeedbackType.Warning);
  const error = () => notificationAsync(NotificationFeedbackType.Error);

  const selection = () => selectionAsync();

  return {
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    warning,
    error,
    selection,
  };
};
