import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

type UseAppStateProps = {
  match: RegExp;
  nextAppState: AppStateStatus;
  callback: () => void;
};

/**
 * Hook to handle app state changes.
 *
 * @param {UseAppStateProps} props The hook properties.
 * @param {RegExp} props.match The regex to match the current app state.
 * @param {AppStateStatus} props.nextAppState The next app state to trigger the callback.
 * @param {() => void} props.callback The callback function to execute when the state changes.
 *
 * @example
 * ```tsx
 * useAppState({
 *   match: /inactive|background/,
 *   nextAppState: 'active',
 *   callback: () => console.log('App has come to the foreground!'),
 * });
 * ```
 */
export function useAppState({
  match,
  nextAppState,
  callback,
}: UseAppStateProps) {
  const appState = useRef(AppState.currentState);
  const [_, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const _handleAppStateChange = (newAppState: AppStateStatus) => {
      // If the state we're coming from matches and
      // the next state is the desired one, fire callback
      if (appState.current.match(match) && newAppState === nextAppState) {
        callback();
      }

      appState.current = newAppState;
      setAppStateVisible(appState.current);
    };

    // First time check (opening App from a killed state)
    if (appState.current === nextAppState) {
      callback();
    }

    // Set up event listener
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [match, nextAppState, callback]);
}
