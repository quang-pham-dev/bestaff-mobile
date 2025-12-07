# Implementation Plan: @bestaff/hooks Package Update

**Branch**: `002-hooks-package-update` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-hooks-package-update/spec.md`

## Summary

Update the `@bestaff/hooks` package to align with monorepo standards: rename all hook files to kebab-case naming convention, add comprehensive Vitest unit tests with 80% coverage threshold, ensure proper type exports, and prepare for version 0.1.0 release. Changes are scoped exclusively to `packages/hooks/**` with no modifications to apps.

## Technical Context

**Language/Version**: TypeScript 5.9+ with strict mode enabled  
**Primary Dependencies**: React 19, React Native 0.81+, Expo SDK 54, react-native-reanimated  
**Storage**: AsyncStorage (mocked in tests), expo-secure-store (mocked in tests)  
**Testing**: Vitest 3.2+ (package-level), @testing-library/react-native for hook testing  
**Target Platform**: React Native (iOS/Android) via Expo  
**Project Type**: Monorepo package (`packages/hooks`)  
**Performance Goals**: Zero runtime overhead from changes (tests only affect dev)  
**Constraints**: API surface must remain stable; no breaking changes  
**Scale/Scope**: 16 files to process (10 renames), 14 hooks requiring tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Constitution Rule | Status | Notes |
|------|-------------------|--------|-------|
| File Naming | §4.2 Files: `kebab-case` | ✅ PASS | Aligning to standard |
| TypeScript Strict | §4.1 `strict: true` mandatory | ✅ PASS | Already configured |
| No `any` | §4.1 Prohibited unless justified | ✅ PASS | Will maintain |
| Package Tests | §5.1 Vitest ≥80% branch coverage | ✅ PASS | Target: 80% |
| Given/When/Then | §5.2 Test structure mandatory | ✅ PASS | Will follow |
| Package README | §12.1 Required | ✅ PASS | Will update |
| JSDoc for exports | §12.2 Required | ✅ PASS | Already present |
| Conventional Commits | §10.1 Mandatory | ✅ PASS | Will follow |
| No shared code in apps | §3.1 Apps: no reusable code | ✅ PASS | Changes only in packages/ |

**Gate Result**: ✅ ALL GATES PASSED

## Project Structure

### Documentation (this feature)

```text
specs/002-hooks-package-update/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 research output
├── quickstart.md        # Quick start guide
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code Changes

```text
packages/hooks/
├── package.json              # [MODIFY] Add test scripts, vitest deps
├── vitest.config.ts          # [CREATE] Vitest configuration
├── vitest.setup.ts           # [CREATE] Test setup with mocks
├── tsconfig.json             # [VERIFY] Ensure test files included
├── src/
│   ├── index.ts              # [MODIFY] Update imports for kebab-case
│   ├── constants.ts          # [NO CHANGE] Already kebab-case
│   │
│   ├── theme-context.tsx     # [RENAME] from ThemeContext.tsx
│   ├── theme-styles-context.tsx  # [RENAME] from ThemeStylesContext.tsx
│   ├── use-theme.ts          # [RENAME] from useTheme.ts
│   ├── use-theme-styles.ts   # [RENAME] from useThemeStyles.ts
│   ├── use-theme-color.ts    # [RENAME] from useThemeColor.ts
│   ├── use-theme-value.ts    # [RENAME] from useThemeValue.ts
│   ├── use-theme-variant.ts  # [RENAME] from useThemeVariant.ts
│   ├── use-debounce.ts       # [RENAME] from useDebounce.ts
│   ├── use-color-scheme.ts   # [RENAME] from useColorScheme.ts
│   ├── use-entry-animation.ts # [RENAME] from useEntryAnimation.ts
│   │
│   ├── use-app-state.ts      # [NO CHANGE] Already kebab-case
│   ├── use-back-handler.ts   # [NO CHANGE] Already kebab-case
│   ├── use-haptics.ts        # [NO CHANGE] Already kebab-case
│   ├── use-is-first-time.ts  # [NO CHANGE] Already kebab-case
│   │
│   └── __tests__/            # [CREATE] Test directory
│       ├── theme-context.test.tsx
│       ├── theme-styles-context.test.tsx
│       ├── use-theme.test.ts
│       ├── use-theme-styles.test.ts
│       ├── use-theme-color.test.ts
│       ├── use-theme-value.test.ts
│       ├── use-theme-variant.test.ts
│       ├── use-debounce.test.ts
│       ├── use-color-scheme.test.ts
│       ├── use-entry-animation.test.ts
│       ├── use-app-state.test.ts
│       ├── use-back-handler.test.ts
│       ├── use-haptics.test.ts
│       └── use-is-first-time.test.ts
├── CHANGELOG.md              # [CREATE] Release changelog
└── README.md                 # [UPDATE] API documentation
```

**Structure Decision**: Package-level structure following existing `@bestaff/logger` pattern with tests in `src/__tests__/` directory.

## Implementation Phases

### Phase 1: Test Infrastructure Setup

1. Add Vitest dependencies to `package.json`
2. Create `vitest.config.ts` with coverage thresholds
3. Create `vitest.setup.ts` with React Native/Expo mocks
4. Update `tsconfig.json` to include test files
5. Verify test command works with empty test suite

### Phase 2: File Renaming (Atomic)

1. Rename all 10 files to kebab-case format
2. Update all internal imports between files
3. Update `index.ts` barrel exports
4. Run type-check to verify no broken imports
5. Run build to verify exports still work

### Phase 3: Unit Tests Implementation

Priority order by dependency:
1. `use-debounce.test.ts` - No dependencies (simplest)
2. `use-color-scheme.test.ts` - Re-export only
3. `use-haptics.test.ts` - External deps only
4. `use-back-handler.test.ts` - RN dependency
5. `use-app-state.test.ts` - RN dependency
6. `use-is-first-time.test.ts` - Expo SecureStore
7. `theme-context.test.tsx` - Provider + AsyncStorage
8. `use-theme.test.ts` - Depends on ThemeContext
9. `theme-styles-context.test.tsx` - Depends on useTheme
10. `use-theme-styles.test.ts` - Depends on ThemeStylesContext
11. `use-theme-color.test.ts` - Depends on useTheme
12. `use-theme-value.test.ts` - Depends on useTheme
13. `use-theme-variant.test.ts` - Depends on useTheme
14. `use-entry-animation.test.ts` - Reanimated (mock heavy)

### Phase 4: Type Exports Review

1. Audit all public types in each file
2. Ensure all interfaces are exported in `index.ts`
3. Add missing type exports if needed
4. Verify IntelliSense works for consumers

### Phase 5: Release Preparation

1. Create `CHANGELOG.md` with version 0.1.0
2. Update `package.json` version to 0.1.0
3. Update `README.md` with current API
4. Final lint, type-check, and test run

## CI Integration

```yaml
# Hooks package specific test command
pnpm --filter @bestaff/hooks test

# With coverage
pnpm --filter @bestaff/hooks test:coverage
```

**Root package.json additions**:
```json
{
  "scripts": {
    "test:hooks": "pnpm --filter @bestaff/hooks test",
    "test:hooks:ui": "pnpm --filter @bestaff/hooks test:ui",
    "test:hooks:coverage": "pnpm --filter @bestaff/hooks test:coverage"
  }
}
```

## Mock Strategy

### React Native Mocks

```typescript
// vitest.setup.ts
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

### Expo Mocks

```typescript
vi.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  selectionAsync: vi.fn(),
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));
```

### Reanimated Mocks

```typescript
vi.mock('react-native-reanimated', () => ({
  useSharedValue: vi.fn((initial) => ({ value: initial })),
  useAnimatedStyle: vi.fn((fn) => fn()),
  withDelay: vi.fn((_, animation) => animation),
  withTiming: vi.fn((value) => value),
  withSpring: vi.fn((value) => value),
  Easing: { bezier: vi.fn() },
}));
```

## Coverage Requirements

| Metric | Threshold | Notes |
|--------|-----------|-------|
| Lines | 80% | Per constitution §5.1 |
| Branches | 70% | Minimum for packages |
| Functions | 80% | All exported functions |
| Statements | 80% | Overall coverage |

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Import path changes break consumers | Keep all exports in index.ts unchanged |
| Reanimated mocking complexity | Use simplified mock strategy |
| AsyncStorage timing in tests | Use fake timers + flush promises |
| Coverage threshold not met | Prioritize high-impact branches |

## Success Verification

```bash
# All must pass
pnpm --filter @bestaff/hooks lint
pnpm --filter @bestaff/hooks check-types
pnpm --filter @bestaff/hooks build
pnpm --filter @bestaff/hooks test:coverage

# Verify coverage thresholds
# Output should show ≥80% lines, ≥70% branches
```

## Complexity Tracking

No complexity violations - this change aligns with constitution standards.
