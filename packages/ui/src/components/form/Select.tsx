import { JSX, type ReactNode, useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  TouchableWithoutFeedback,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@bestaff/hooks';

import { Icon } from '@/components/common/Icon';
import { Typography } from '@/components/common/Typography';

import { useSelectStyles } from './Select.styles';

/**
 * Option type for Select items
 */
export interface SelectOption<T> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: ReactNode;
}

/**
 * Props for the Select component
 */
export interface SelectProps<T> extends ViewProps {
  /**
   * Array of select options
   */
  options: SelectOption<T>[];

  /**
   * Currently selected value
   */
  value: T | null;

  /**
   * Callback when selection changes
   */
  onValueChange: (value: T) => void;

  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string;

  /**
   * Whether the select is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Custom trigger component
   */
  triggerComponent?: ReactNode;

  /**
   * Maximum height of the dropdown
   * @default 300
   */
  maxHeight?: number;

  /**
   * Additional style for the container
   */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Select Component
 *
 * A customizable select/dropdown component with theme integration.
 *
 * @example
 * ```tsx
 * Basic usage
 * const options = [
 *   { label: 'Option 1', value: '1' },
 *   { label: 'Option 2', value: '2' },
 * ];
 *
 * const [value, setValue] = useState(null);
 *
 * <Select
 *   options={options}
 *   value={value}
 *   onValueChange={setValue}
 *   placeholder="Select an option"
 * />
 *
 * With icons
 * const optionsWithIcons = [
 *   {
 *     label: 'Settings',
 *     value: 'settings',
 *     icon: <Icon name="settings" />
 *   },
 * ];
 *
 * <Select
 *   options={optionsWithIcons}
 *   value={value}
 *   onValueChange={setValue}
 * />
 * ```
 */
export function Select<T>({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  triggerComponent,
  maxHeight = 300,
  style,
  containerStyle,
  ...props
}: SelectProps<T>): JSX.Element {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (optionValue: T) => {
      onValueChange(optionValue);
      handleClose();
    },
    [onValueChange, handleClose],
  );

  const styles = useSelectStyles(maxHeight)(theme);

  const renderTrigger = () => {
    if (triggerComponent) return triggerComponent;

    return (
      <View style={[styles.trigger, disabled && styles.disabled]}>
        <Typography
          style={styles.triggerText}
          color={selectedOption ? 'text' : 'textSecondary'}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Typography>
        <Icon
          name="chevron-down"
          size={20}
          color={theme.colors.textSecondary}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle, style]} {...props}>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled }}
      >
        {renderTrigger()}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <ScrollView
                  style={styles.scrollView}
                  contentContainerStyle={styles.optionsList}
                >
                  {options.map((option) => (
                    <Pressable
                      key={`select-option-${String(option.value)}`}
                      style={[
                        styles.option,
                        value === option.value && styles.selectedOption,
                        option.disabled && styles.disabled,
                      ]}
                      onPress={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      accessibilityRole="menuitem"
                      accessibilityState={{
                        selected: value === option.value,
                        disabled: option.disabled,
                      }}
                    >
                      {option.icon && (
                        <View style={styles.optionIcon}>{option.icon}</View>
                      )}
                      <Typography>{option.label}</Typography>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
