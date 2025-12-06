import { JSX } from 'react';
import {
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@bestaff/hooks';

import { Typography } from '@/components/common/Typography';

import { useFormFieldStyles } from './FormField.styles';

/**
 * Props for the FormField component
 */
export interface FormFieldProps extends ViewProps {
  /**
   * Label for the form field
   */
  label?: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text to display below the field
   */
  helperText?: string;

  /**
   * Whether the field is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional style for the container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Additional style for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>;
}

/**
 * FormField Component
 *
 * A wrapper component for form inputs that provides consistent styling,
 * labels, error handling, and helper text.
 *
 * @example
 * ```tsx
 * Basic usage with Input
 * <FormField label="Email">
 *   <Input placeholder="Enter email" />
 * </FormField>
 *
 * With validation error
 * <FormField
 *   label="Password"
 *   required
 *   error="Password is required"
 * >
 *   <Input
 *     placeholder="Enter password"
 *     secureTextEntry
 *   />
 * </FormField>
 *
 * With helper text
 * <FormField
 *   label="Username"
 *   helperText="Choose a unique username"
 * >
 *   <Input placeholder="Enter username" />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  required,
  error,
  helperText,
  disabled,
  children,
  style,
  containerStyle,
  inputWrapperStyle,
  ...props
}: React.PropsWithChildren<FormFieldProps>): JSX.Element {
  const { theme } = useTheme();
  const styles = useFormFieldStyles(theme);

  return (
    <View
      style={[
        styles.container,
        disabled && styles.disabled,
        containerStyle,
        style,
      ]}
      {...props}
    >
      {label && (
        <View style={styles.labelContainer}>
          <Typography variant="subtitle" color="textSecondary">
            {label}
          </Typography>
          {required && (
            <Typography variant="caption" style={styles.required}>
              *
            </Typography>
          )}
        </View>
      )}

      <View style={[styles.inputWrapper, inputWrapperStyle]}>{children}</View>

      {(error || helperText) && (
        <Typography
          variant="caption"
          style={[
            styles.helperText,
            error ? styles.error : { color: theme.colors.textSecondary },
          ]}
        >
          {error || helperText}
        </Typography>
      )}
    </View>
  );
}

/**
 * Hook for consuming FormField context in child components
 * Useful for custom form components that need to access field state
 */
export function useFormField() {
  return {
    disabled: false, // To be implemented with context if needed
    error: undefined,
    required: false,
  };
}
