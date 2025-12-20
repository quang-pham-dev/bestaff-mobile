import { vi } from 'vitest';

// Mock react-native modules
vi.mock('react-native', () => ({
  Dimensions: {
    get: vi.fn(() => ({
      width: 375,
      height: 812,
    })),
  },
  PixelRatio: {
    get: vi.fn(() => 2),
    roundToNearestPixel: vi.fn((size: number) => Math.round(size)),
  },
  Platform: {
    OS: 'ios',
    select: vi.fn(
      (options: Record<string, unknown>) => options.ios ?? options.default,
    ),
  },
  StatusBar: {
    currentHeight: 24,
  },
  StyleSheet: {
    create: <T extends Record<string, unknown>>(styles: T): T => styles,
  },
  useWindowDimensions: vi.fn(() => ({
    width: 375,
    height: 812,
  })),
}));
