import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import { Theme } from './theme';
import { flex, spacing } from './tokens';

// Improve type definitions
type BaseStyle = ViewStyle | TextStyle | ImageStyle;
type StyleValue = BaseStyle | null | undefined;
type StyleFunction = (
  ...args: (string | number | boolean | undefined)[]
) => StyleValue;

// More specific custom style keys
type LayoutStyleKeys = 'fill' | 'container' | 'row' | 'column';
type TextAlignmentKeys = 'textAlignLeft' | 'textAlignRight' | 'textAlignCenter';
type CustomStyleKeys = LayoutStyleKeys | TextAlignmentKeys;

type StylePropertyValue = StyleValue | StyleFunction | number;

export type ThemeStyles = {
  [K in
    | keyof typeof spacing
    | keyof typeof flex
    | CustomStyleKeys]: StylePropertyValue;
};

export const styles = (theme: Theme): ThemeStyles => ({
  ...spacing,
  ...flex,

  // Layout styles
  fill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },

  // Text alignment styles
  textAlignLeft: {
    textAlign: 'left',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
});
