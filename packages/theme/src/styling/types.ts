import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';

import { type Theme } from '../theme';

/**
 * Base style types that can be used in style objects
 */
export type BaseStyle = ViewStyle | TextStyle | ImageStyle;

/**
 * Style object with string keys and style values
 */
export type StyleObject = Record<string, BaseStyle>;

/**
 * Factory function that creates styles from theme
 */
export type StyleFactory<T extends StyleObject> = () => T;

/**
 * Style creator function that receives theme and returns styles
 */
export type StyleCreator<T extends StyleObject> = (theme: Theme) => T;
