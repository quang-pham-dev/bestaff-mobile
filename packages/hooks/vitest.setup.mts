import { vi } from 'vitest';

// ============================================================================
// React Native Core Mocks
// ============================================================================

vi.mock('react-native', () => ({
  Appearance: {
    getColorScheme: vi.fn(() => 'light'),
    addChangeListener: vi.fn(() => ({ remove: vi.fn() })),
  },
  AppState: {
    currentState: 'active',
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
  BackHandler: {
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
  useColorScheme: vi.fn(() => 'light'),
}));

// ============================================================================
// AsyncStorage Mock
// ============================================================================

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
  },
}));

// ============================================================================
// Expo Haptics Mock
// ============================================================================

vi.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  impactAsync: vi.fn().mockResolvedValue(undefined),
  notificationAsync: vi.fn().mockResolvedValue(undefined),
  selectionAsync: vi.fn().mockResolvedValue(undefined),
}));

// ============================================================================
// Expo SecureStore Mock
// ============================================================================

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

// ============================================================================
// React Native Reanimated Mock
// ============================================================================

vi.mock('react-native-reanimated', () => ({
  useSharedValue: vi.fn((initial) => ({ value: initial })),
  useAnimatedStyle: vi.fn((fn) => fn()),
  withDelay: vi.fn((_, animation) => animation),
  withTiming: vi.fn((value) => value),
  withSpring: vi.fn((value) => value),
  Easing: {
    bezier: vi.fn(() => (t: number) => t),
  },
}));

// ============================================================================
// @bestaff/theme Mock
// ============================================================================

vi.mock('@bestaff/theme', () => ({
  lightTheme: {
    mode: 'light',
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      body: { fontSize: 16, fontWeight: 'normal' },
    },
  },
  darkTheme: {
    mode: 'dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      error: '#FF453A',
      success: '#32D74B',
      warning: '#FF9F0A',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      body: { fontSize: 16, fontWeight: 'normal' },
    },
  },
  styles: vi.fn((theme) => ({
    container: { flex: 1, backgroundColor: theme.colors.background },
    text: { color: theme.colors.text },
  })),
}));

// ============================================================================
// @bestaff/utils Mock
// ============================================================================

vi.mock('@bestaff/utils/error', () => ({
  logError: vi.fn(),
}));

vi.mock('@bestaff/utils/create-styles', () => ({
  createStyleUtils: vi.fn(() => ({
    spacing: vi.fn(),
    colors: vi.fn(),
    typography: vi.fn(),
  })),
}));
