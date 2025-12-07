# Research: @bestaff/hooks Package Update

**Date**: 2025-12-07  
**Feature**: `002-hooks-package-update`

## Research Summary

This document consolidates all research findings for the @bestaff/hooks package update, covering testing strategy, file naming conventions, and mock implementations.

---

## 1. Testing Framework Decision

### Decision: Vitest

**Rationale**:
- Already used in `@bestaff/logger` package - maintains consistency
- Listed in pnpm-workspace.yaml catalog: `vitest: ^3.2.4`
- Native ESM support aligns with package structure
- Better performance than Jest for packages
- Built-in coverage with v8 provider

**Alternatives Considered**:

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Jest | Used in mobile-app | Slower for packages, ESM issues | ❌ Rejected |
| Vitest | Fast, ESM native, already in use | React Native mocking needed | ✅ Selected |

---

## 2. React Hook Testing Strategy

### Decision: @testing-library/react-native + renderHook

**Rationale**:
- Already available in testing catalog
- Standard approach for React Native hook testing
- Provides `renderHook` utility for isolated hook testing
- Works well with Vitest

**Pattern Example**:
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  it('should return debounced value after delay', async () => {
    // Given: Initial value
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // When: Value changes
    rerender({ value: 'updated', delay: 500 });

    // Then: Value should be debounced
    expect(result.current).toBe('initial');
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current).toBe('updated');
  });
});
```

---

## 3. File Naming Convention

### Decision: kebab-case for all files

**Rationale**:
- Constitution §4.2 mandates kebab-case for files
- 6 files already follow convention (e.g., `use-app-state.ts`)
- 10 files need renaming (e.g., `useDebounce.ts` → `use-debounce.ts`)
- Internal-only change; API exports remain unchanged

**Rename Mapping**:

| Current | New | Type |
|---------|-----|------|
| `ThemeContext.tsx` | `theme-context.tsx` | Context + Provider |
| `ThemeStylesContext.tsx` | `theme-styles-context.tsx` | Context + Provider |
| `useColorScheme.ts` | `use-color-scheme.ts` | Hook (re-export) |
| `useDebounce.ts` | `use-debounce.ts` | Hook |
| `useEntryAnimation.ts` | `use-entry-animation.ts` | Hook |
| `useTheme.ts` | `use-theme.ts` | Hook |
| `useThemeColor.ts` | `use-theme-color.ts` | Hook |
| `useThemeStyles.ts` | `use-theme-styles.ts` | Hook |
| `useThemeValue.ts` | `use-theme-value.ts` | Hook |
| `useThemeVariant.ts` | `use-theme-variant.ts` | Hook |

---

## 4. React Native Mock Strategy

### Decision: Centralized mocks in vitest.setup.ts

**Rationale**:
- Avoid duplicating mocks across test files
- Consistent behavior across all tests
- Easy to maintain and update

**Required Mocks**:

#### 4.1 react-native Core

```typescript
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
```

#### 4.2 AsyncStorage

```typescript
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    getAllKeys: vi.fn(),
  },
}));
```

#### 4.3 Expo Haptics

```typescript
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
```

#### 4.4 Expo SecureStore

```typescript
vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));
```

#### 4.5 React Native Reanimated

```typescript
vi.mock('react-native-reanimated', () => {
  const actual = vi.importActual('react-native-reanimated');
  return {
    ...actual,
    useSharedValue: vi.fn((initial) => ({ value: initial })),
    useAnimatedStyle: vi.fn((fn) => fn()),
    withDelay: vi.fn((_, animation) => animation),
    withTiming: vi.fn((value) => value),
    withSpring: vi.fn((value) => value),
    Easing: {
      bezier: vi.fn(() => (t: number) => t),
    },
  };
});
```

---

## 5. Coverage Strategy

### Decision: 80% lines, 70% branches minimum

**Rationale**:
- Constitution §5.1: Vitest ≥80% branch coverage for packages
- Focus on high-impact code paths
- Allow flexibility for edge cases that are hard to test

**Coverage Configuration**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.d.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
```

---

## 6. Test Directory Structure

### Decision: `src/__tests__/` directory

**Rationale**:
- Following `@bestaff/logger` pattern (`src/tests/`)
- Keeps tests close to source
- Excluded from build via tsconfig
- Clear separation from source files

**Alternative Considered**:
- Co-located tests (`*.test.ts` next to source) - rejected for cleaner src/ structure

---

## 7. Async Testing Patterns

### Decision: Use fake timers for debounce/timing tests

**Rationale**:
- Tests run synchronously (faster)
- Deterministic timing behavior
- Avoid flaky tests from real timers

**Pattern**:
```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('should debounce value', async () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'a' } }
  );

  rerender({ value: 'b' });
  expect(result.current).toBe('a');

  await act(async () => {
    vi.advanceTimersByTime(300);
  });

  expect(result.current).toBe('b');
});
```

---

## 8. Provider Testing Pattern

### Decision: Custom wrapper for context-dependent hooks

**Rationale**:
- Many hooks depend on ThemeContext
- Need consistent wrapper for testing
- Avoid duplication across test files

**Pattern**:
```typescript
// test-utils.tsx
import { ThemeProvider } from '../theme-context';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

export const renderHookWithProviders = <T,>(
  hook: () => T,
  options?: RenderHookOptions<T>
) => renderHook(hook, { wrapper: AllProviders, ...options });
```

---

## 9. Type Export Strategy

### Decision: Explicit type exports in index.ts

**Rationale**:
- Constitution §4.1: Export types for all public APIs
- Better IntelliSense for consumers
- Clearer public API surface

**Types to Export**:
```typescript
// index.ts
export type { ThemeContextType } from './theme-context';
export type { ThemeStylesContextType } from './theme-styles-context';
export type { UseAppStateProps } from './use-app-state';
export type { EntryAnimationConfig } from './use-entry-animation';
// ... etc
```

---

## 10. Version Bump Decision

### Decision: Minor version bump (0.0.0 → 0.1.0)

**Rationale**:
- Adding new features (tests, better types)
- No breaking changes to public API
- File renames are internal implementation detail
- Following SemVer for internal consistency

---

## Research Complete

All technical decisions have been made. Ready for implementation phase.

