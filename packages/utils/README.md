# @bestaff/utils

<div align="center">

Shared utility functions and helpers for BestAff React Native applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)

</div>

---

## 📋 Table of Contents

- [Installation](#installation)
- [Utilities](#utilities)
  - [Platform Utilities](#platform-utilities)
  - [Style Utilities](#style-utilities) - [Error Handling](#error-handling)
  - [Notifications](#notifications)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)

## 🚀 Installation

This package is part of the BestAff monorepo and is automatically available to workspace packages.

```typescript
import { createStyleUtils } from '@bestaff/utils/create-styles';
import { handleError } from '@bestaff/utils/error';
import { createNotification } from '@bestaff/utils/notification';
import { isAndroid, isIOS } from '@bestaff/utils/platform';
```

## 🛠 Utilities

### Platform Utilities

Platform detection and platform-specific utilities.

```typescript
import {
  isIOS,
  isAndroid,
  getBottomSpace,
  getTopSpace,
  getSafeAreaInsets,
  hasNotch,
  ANDROID_STATUS_BAR_HEIGHT,
  ANDROID_NAVIGATION_BAR_HEIGHT,
} from '@bestaff/utils/platform';

// Platform checks
if (isIOS) {
  // iOS-specific code
}

if (isAndroid) {
  // Android-specific code
}

// Safe area handling
function MyComponent() {
  const insets = useSafeAreaInsets();
  const bottomSpace = getBottomSpace(insets);
  const topSpace = getTopSpace(insets);

  return (
    <View style={{ paddingTop: topSpace, paddingBottom: bottomSpace }}>
      {/* Content */}
    </View>
  );
}

// Device detection
const deviceHasNotch = hasNotch(); // true for iPhone X and newer
```

**Exports:**

| Export                          | Type     | Description                        |
| ------------------------------- | -------- | ---------------------------------- |
| `isIOS`                         | boolean  | True if running on iOS             |
| `isAndroid`                     | boolean  | True if running on Android         |
| `ANDROID_STATUS_BAR_HEIGHT`     | number   | Android status bar height          |
| `ANDROID_NAVIGATION_BAR_HEIGHT` | number   | Android navigation bar height (44) |
| `getBottomSpace(insets)`        | function | Get bottom safe area spacing       |
| `getTopSpace(insets)`           | function | Get top safe area spacing          |
| `getSafeAreaInsets(insets)`     | function | Get platform-adjusted safe area    |
| `hasNotch()`                    | function | Check if device has notch          |

### Style Utilities

Helper functions for creating themed, cached styles.

```typescript
import { createStyleUtils } from '@bestaff/utils/create-styles';
import { useTheme } from '@bestaff/theme';

function MyComponent() {
  const theme = useTheme();
  const styles = useAppStyles();
  const utils = createStyleUtils(theme, styles);

  const componentStyles = utils.createThemedStyle((theme) => ({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.md,
    },
    text: {
      color: theme.colors.text,
      ...theme.typography.bodyMedium,
    },
  }));

  // Get fullscreen centered styles
  const centeredStyles = utils.getFullscreenCenteredContentStyles();

  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.text}>Hello</Text>
    </View>
  );
}
```

**Features:**

- ✅ Style caching for performance
- ✅ Theme-aware style creation
- ✅ Type-safe style objects
- ✅ Automatic memoization
- ✅ Fullscreen centered utilities

**API:**

```typescript
interface StyleUtils {
  // Create themed styles with caching
  createThemedStyle<T extends StyleObject>(
    styleCreator: (theme: Theme) => T,
  ): T;

  // Get fullscreen centered content styles
  getFullscreenCenteredContentStyles(): ViewStyle[];
}
```

### Error Handling

Comprehensive error handling and logging utilities.

```typescript
import { handleError, logError } from '@bestaff/utils/error';

// Handle errors with structured response
try {
  await riskyOperation();
} catch (error) {
  const errorResponse = handleError(error);
  console.log(errorResponse.message); // User-friendly message
  console.log(errorResponse.code); // Error code
  console.log(errorResponse.details); // Full error details
}

// Log errors with context
try {
  await apiCall();
} catch (error) {
  logError(error, 'API Call');
  // Logs: [API Call] APP_ERROR: Error message
}
```

**Error Types:**

- `Error` objects - Standard JavaScript errors
- API errors - Structured error responses
- Unknown errors - Safely handled with fallback

**API:**

```typescript
interface ErrorResponse {
  message: string; // User-friendly error message
  code?: string; // Error code (APP_ERROR, API_ERROR, UNKNOWN_ERROR)
  details?: unknown; // Full error details
}

// Handle any error type  convert to ErrorResponse
function handleError(error: ErrorType): ErrorResponse;

// Log error to console (dev) and reporting services
function logError(error: ErrorType, context?: string): void;
```

### Notifications

React Native notification helpers for scheduling local notifications.

```typescript
import * as Notifications from 'expo-notifications';

import {
  createCalendarTrigger,
  createNotification,
  createScheduleTrigger,
} from '@bestaff/utils/notification';

// Create notification content
const notification = createNotification(
  'Hello',
  'This is a notification',
  { userId: '123' }, // Optional data
);

// Schedule with time interval (5 seconds)
const trigger = createScheduleTrigger(5);
await Notifications.scheduleNotificationAsync({
  content: notification,
  trigger,
});

// Schedule at specific date/time
const dateTime = new Date('2024-12-31T12:00:00');
const calendarTrigger = createCalendarTrigger(dateTime);
await Notifications.scheduleNotificationAsync({
  content: notification,
  trigger: calendarTrigger,
});
```

**API:**

```typescript
// Create notification content
function createNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): NotificationContentInput;

// Create interval-based trigger
function createScheduleTrigger(seconds: number): NotificationTriggerInput;

// Create calendar-based trigger
function createCalendarTrigger(dateTime: Date): NotificationTriggerInput;
```

## 📖 Usage Examples

### Example 1: Platform-Specific Styling

```typescript
import { isIOS, isAndroid, getBottomSpace } from '@bestaff/utils/platform';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: getBottomSpace(insets),
        // Platform-specific styling
        ...Platform.select({
          ios: { shadowOpacity: 0.3 },
          android: { elevation: 5 },
        }),
      }}
    >
      <Text>Platform-aware component</Text>
    </View>
  );
}
```

### Example 2: Themed Styles with Caching

```typescript
import { createStyleUtils } from '@bestaff/utils/create-styles';
import { useTheme } from '@bestaff/theme';

function ProductCard() {
  const theme = useTheme();
  const utils = createStyleUtils(theme, {});

  // Styles are created once and cached
  const styles = utils.createThemedStyle((theme) => ({
    card: {
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.md,
    },
    title: {
      ...theme.typography.heading3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    price: {
      ...theme.typography.bodyLarge,
      color: theme.colors.primary,
      fontWeight: '600',
    },
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Product Name</Text>
      <Text style={styles.price}>$99.99</Text>
    </View>
  );
}
```

### Example 3: Error Handling in API Calls

```typescript
import { handleError, logError } from '@bestaff/utils/error';

async function fetchUserData(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
  } catch (error) {
    // Log error for debugging
    logError(error, 'fetchUserData');

    // Handle error and show to user
    const { message } = handleError(error);
    Alert.alert('Error', message);

    return null;
  }
}
```

### Example 4: Scheduled Notifications

```typescript
import * as Notifications from 'expo-notifications';

import {
  createCalendarTrigger,
  createNotification,
  createScheduleTrigger,
} from '@bestaff/utils/notification';

// Schedule reminder in 1 hour
async function scheduleReminder() {
  const notification = createNotification(
    'Reminder',
    "Don't forget to check your tasks!",
    { type: 'reminder' },
  );

  const trigger = createScheduleTrigger(3600); // 1 hour

  await Notifications.scheduleNotificationAsync({
    content: notification,
    trigger,
  });
}

// Schedule daily notification at 9 AM
async function scheduleDailyNotification() {
  const tomorrow9AM = new Date();
  tomorrow9AM.setDate(tomorrow9AM.getDate() + 1);
  tomorrow9AM.setHours(9, 0, 0, 0);

  const notification = createNotification(
    'Good Morning!',
    'Time to start your day',
    { type: 'daily' },
  );

  const trigger = createCalendarTrigger(tomorrow9AM);

  await Notifications.scheduleNotificationAsync({
    content: notification,
    trigger,
  });
}
```

## 🎯 Best Practices

### 1. Platform Detection

```typescript
// ✅ Good - Use platform utilities
// ❌ Avoid - Direct Platform API (less readable)
import { Platform } from 'react-native';

import { isAndroid, isIOS } from '@bestaff/utils/platform';

if (isIOS) {
  // iOS-specific
}

if (Platform.OS === 'ios') {
  // ...
}
```

### 2. Error Handling

```typescript
// ✅ Good - Structured error handling
try {
  await operation();
} catch (error) {
  logError(error, 'operation');
  const { message } = handleError(error);
  showAlert(message);
}

// ❌ Avoid - Generic error handling
try {
  await operation();
} catch (error) {
  console.log(error);
  alert('Something went wrong');
}
```

### 3. Style Caching

```typescript
// ✅ Good - Use createThemedStyle for caching
const utils = createStyleUtils(theme, styles);
const componentStyles = utils.createThemedStyle((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
}));

// ❌ Avoid - Creating styles on every render
const componentStyles = {
  container: {
    backgroundColor: theme.colors.background,
  },
};
```

## 🤝 Contributing

To add new utilities:

1. Create utility file in `src/`
2. Export from the file
3. Update this README with documentation
4. Add usage examples
5. Ensure TypeScript types are correct

---

<div align="center">
Part of the @bestaff monorepo
</div>
