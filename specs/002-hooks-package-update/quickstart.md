# Quickstart: @bestaff/hooks Package Update

**Feature**: `002-hooks-package-update`  
**Date**: 2025-12-07

## Prerequisites

- Node.js ≥20
- pnpm ≥9.15.0
- Branch: `002-hooks-package-update`

## Quick Commands

```bash
# Navigate to hooks package
cd packages/hooks

# Install dependencies (from root)
cd ../.. && pnpm install

# Run tests
pnpm --filter @bestaff/hooks test

# Run tests with UI
pnpm --filter @bestaff/hooks test:ui

# Run tests with coverage
pnpm --filter @bestaff/hooks test:coverage

# Type check
pnpm --filter @bestaff/hooks check-types

# Lint
pnpm --filter @bestaff/hooks lint

# Build
pnpm --filter @bestaff/hooks build
```

## Development Workflow

### 1. Setup Test Infrastructure

```bash
# First, ensure vitest is installed
pnpm --filter @bestaff/hooks add -D vitest @vitest/ui @testing-library/react-native

# Create vitest config
touch packages/hooks/vitest.config.ts
touch packages/hooks/vitest.setup.ts
```

### 2. File Renaming

```bash
# From packages/hooks/src directory
cd packages/hooks/src

# Rename files (example)
git mv ThemeContext.tsx theme-context.tsx
git mv useDebounce.ts use-debounce.ts
# ... continue for all files
```

### 3. Running Individual Tests

```bash
# Run specific test file
pnpm --filter @bestaff/hooks test use-debounce

# Run tests matching pattern
pnpm --filter @bestaff/hooks test -- --grep "useTheme"

# Watch mode for single file
pnpm --filter @bestaff/hooks test -- --watch use-debounce
```

## File Structure After Changes

```
packages/hooks/
├── package.json           # Updated with vitest
├── vitest.config.ts       # NEW
├── vitest.setup.ts        # NEW (mocks)
├── src/
│   ├── index.ts           # Updated imports
│   ├── constants.ts
│   ├── theme-context.tsx  # Renamed
│   ├── use-theme.ts       # Renamed
│   ├── use-debounce.ts    # Renamed
│   └── __tests__/         # NEW
│       ├── theme-context.test.tsx
│       ├── use-theme.test.ts
│       └── use-debounce.test.ts
├── CHANGELOG.md           # NEW
└── README.md              # Updated
```

## Test Template

Use this template for new test files:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-native';
import { useHookName } from '../use-hook-name';

describe('useHookName', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('normal usage', () => {
    it('should return expected value', () => {
      // Given: Initial setup
      const { result } = renderHook(() => useHookName());

      // When: No action needed for initial render

      // Then: Assert expected state
      expect(result.current).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should throw when used outside provider', () => {
      // Given: No provider wrapper

      // When/Then: Expect error
      expect(() => {
        renderHook(() => useHookName());
      }).toThrow('useHookName must be used within Provider');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      // Given: Empty input
      const { result } = renderHook(() => useHookName(''));

      // When: Check result

      // Then: Assert handling
      expect(result.current).toBe('');
    });
  });
});
```

## Coverage Requirements

| Metric | Target |
|--------|--------|
| Lines | ≥80% |
| Branches | ≥70% |
| Functions | ≥80% |
| Statements | ≥80% |

## Common Issues & Solutions

### Mock Not Working

```typescript
// Ensure mock is at top of file, before imports
vi.mock('react-native', () => ({
  Appearance: { getColorScheme: vi.fn(() => 'light') },
}));

import { useColorScheme } from 'react-native'; // Import AFTER mock
```

### Async Hook Testing

```typescript
it('should handle async state', async () => {
  const { result } = renderHook(() => useAsyncHook());

  // Wait for state update
  await act(async () => {
    await vi.runAllTimersAsync();
  });

  expect(result.current.data).toBeDefined();
});
```

### Context Provider Wrapper

```typescript
import { ThemeProvider } from '../theme-context';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const { result } = renderHook(() => useTheme(), { wrapper });
```

## Verification Checklist

Before submitting PR:

- [ ] All tests pass: `pnpm --filter @bestaff/hooks test`
- [ ] Coverage meets threshold: `pnpm --filter @bestaff/hooks test:coverage`
- [ ] Types pass: `pnpm --filter @bestaff/hooks check-types`
- [ ] Lint passes: `pnpm --filter @bestaff/hooks lint`
- [ ] Build succeeds: `pnpm --filter @bestaff/hooks build`
- [ ] CHANGELOG.md updated
- [ ] package.json version bumped to 0.1.0

## Useful Links

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library React Native](https://callstack.github.io/react-native-testing-library/)
- [Constitution §5 Testing Standards](../../.specify/memory/constitution.md#5-testing-standards)

