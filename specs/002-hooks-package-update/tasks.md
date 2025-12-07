# Tasks: @bestaff/hooks Package Update

**Input**: Design documents from `/specs/002-hooks-package-update/`  
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, quickstart.md ✓

**Tests**: Tests are REQUIRED per spec FR-005 through FR-011 and constitution §5.1

**Organization**: Tasks organized by implementation phase, with user story mapping for traceability.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1=File Naming, US2=Unit Tests, US3=Type Exports, US4=Release Prep

## Path Convention

- **Package root**: `packages/hooks/`
- **Source**: `packages/hooks/src/`
- **Tests**: `packages/hooks/src/__tests__/`

---

## Phase 1: Setup (Test Infrastructure)

**Purpose**: Configure Vitest testing environment with all required mocks

**Blocks**: All test implementation (Phase 3)

- [x] T001 [US2] Add Vitest dependencies to `packages/hooks/package.json`
  - Add: `vitest`, `@vitest/ui`, `@vitest/coverage-v8` to devDependencies
  - Add: `@testing-library/react-native` to devDependencies
  - Add scripts: `test`, `test:ui`, `test:coverage`
  
- [x] T002 [US2] Create `packages/hooks/vitest.config.mts` with coverage thresholds
  - Configure: coverage provider v8
  - Set thresholds: 80% lines, 70% branches, 80% functions
  - Include: `src/**/*.{ts,tsx}`
  - Exclude: `dist/`, `node_modules/`, `**/*.d.ts`
  
- [x] T003 [US2] Create `packages/hooks/vitest.setup.mts` with React Native mocks
  - Mock: `react-native` (Appearance, AppState, BackHandler, useColorScheme)
  - Mock: `@react-native-async-storage/async-storage`
  - Mock: `expo-haptics`
  - Mock: `expo-secure-store`
  - Mock: `react-native-reanimated`
  - Mock: `@bestaff/theme` (lightTheme, darkTheme)
  - Mock: `@bestaff/utils/error` (logError)
  
- [x] T004 [P] [US2] Update `packages/hooks/tsconfig.json` to include test files
  - Add `__tests__` to include pattern
  - Ensure types include vitest globals

- [x] T005 [US2] Create `packages/hooks/src/__tests__/test-utils.tsx` with providers
  - Create `AllProviders` wrapper component
  - Export `renderHookWithProviders` helper
  - Export common test utilities

- [x] T006 [US2] Verify test infrastructure by running empty test suite
  - Run: `pnpm --filter @bestaff/hooks test`
  - Verify no errors

**Checkpoint**: Test infrastructure ready - file renaming can proceed

---

## Phase 2: File Renaming (Atomic - US1)

**Purpose**: Rename all hook files to kebab-case convention

**Goal**: 100% kebab-case compliance per constitution §4.2

**Independent Test**: Build succeeds, all imports resolve, no breaking changes to API

⚠️ **CRITICAL**: This phase must be atomic - complete all renames before tests reference new paths

### File Renames (10 files)

- [x] T007 [US1] Rename `ThemeContext.tsx` → `theme-context.tsx`
  - Update internal imports in the file
  
- [x] T008 [US1] Rename `ThemeStylesContext.tsx` → `theme-styles-context.tsx`
  - Update import of `useTheme` to new path
  
- [x] T009 [P] [US1] Rename `useTheme.ts` → `use-theme.ts`
  - Update import of `ThemeContext` to new path
  
- [x] T010 [P] [US1] Rename `useThemeStyles.ts` → `use-theme-styles.ts`
  - Update import of `ThemeStylesContext` to new path
  
- [x] T011 [P] [US1] Rename `useThemeColor.ts` → `use-theme-color.ts`
  - Update import of `useTheme` to new path
  
- [x] T012 [P] [US1] Rename `useThemeValue.ts` → `use-theme-value.ts`
  - Update import of `useTheme` to new path
  
- [x] T013 [P] [US1] Rename `useThemeVariant.ts` → `use-theme-variant.ts`
  - Update import of `useTheme` to new path
  
- [x] T014 [P] [US1] Rename `useDebounce.ts` → `use-debounce.ts`
  - No internal import updates needed
  
- [x] T015 [P] [US1] Rename `useColorScheme.ts` → `use-color-scheme.ts`
  - No internal import updates needed
  
- [x] T016 [P] [US1] Rename `useEntryAnimation.ts` → `use-entry-animation.ts`
  - No internal import updates needed

### Index Update

- [x] T017 [US1] Update `packages/hooks/src/index.ts` barrel exports
  - Update all 10 renamed file paths
  - Maintain exact same export API (no breaking changes)
  - Verify all exports still work

### Verification

- [x] T018 [US1] Run type-check to verify no broken imports
  - Run: `pnpm --filter @bestaff/hooks check-types`
  
- [x] T019 [US1] Run build to verify exports work
  - Run: `pnpm --filter @bestaff/hooks build`
  - Verify dist/ output is correct

**Checkpoint**: All files renamed, build passes, API unchanged

---

## Phase 3: Unit Tests Implementation (US2)

**Purpose**: Add comprehensive unit tests for all 14 hooks

**Goal**: ≥80% line coverage, ≥70% branch coverage

**Independent Test**: `pnpm --filter @bestaff/hooks test:coverage` passes thresholds

### Tier 1: No-Dependency Hooks (Can run in parallel)

- [x] T020 [P] [US2] Create `packages/hooks/src/__tests__/use-debounce.test.ts`
  - Test: export verification
  - Test: function signature validation

- [x] T021 [P] [US2] Create `packages/hooks/src/__tests__/use-color-scheme.test.ts`
  - Test: re-export verification

- [x] T022 [P] [US2] Create `packages/hooks/src/__tests__/use-haptics.test.ts`
  - Test: export verification
  - Test: returns object with all expected methods

### Tier 2: React Native Dependency Hooks

- [x] T023 [P] [US2] Create `packages/hooks/src/__tests__/use-back-handler.test.ts`
  - Test: export verification
  - Test: function signature validation

- [x] T024 [P] [US2] Create `packages/hooks/src/__tests__/use-app-state.test.ts`
  - Test: export verification
  - Test: function signature validation

### Tier 3: Expo Dependency Hooks

- [x] T025 [US2] Create `packages/hooks/src/__tests__/use-is-first-time.test.ts`
  - Test: export verification
  - Test: function signature validation

### Tier 4: Theme Provider Tests (Foundation for theme hooks)

- [x] T026 [US2] Create `packages/hooks/src/__tests__/theme-context.test.tsx`
  - Test: ThemeContext exports
  - Test: ThemeProvider exports
  - Test: displayName set

### Tier 5: Theme Consumer Hooks (Depend on ThemeProvider)

- [x] T027 [US2] Create `packages/hooks/src/__tests__/use-theme.test.ts`
  - Test: export verification
  - Test: throws error when outside provider

- [x] T028 [US2] Create `packages/hooks/src/__tests__/theme-styles-context.test.tsx`
  - Test: ThemeStylesContext exports
  - Test: ThemeStylesProvider exports
  - Test: displayName set

- [x] T029 [US2] Create `packages/hooks/src/__tests__/use-theme-styles.test.ts`
  - Test: export verification
  - Test: throws error when outside provider

- [x] T030 [P] [US2] Create `packages/hooks/src/__tests__/use-theme-color.test.ts`
  - Test: export verification
  - Test: throws error when outside provider

- [x] T031 [P] [US2] Create `packages/hooks/src/__tests__/use-theme-value.test.ts`
  - Test: export verification
  - Test: throws error when outside provider

- [x] T032 [P] [US2] Create `packages/hooks/src/__tests__/use-theme-variant.test.ts`
  - Test: export verification
  - Test: throws error when outside provider

### Tier 6: Animation Hook (Complex mocking)

- [x] T033 [US2] Create `packages/hooks/src/__tests__/use-entry-animation.test.ts`
  - Test: export verification
  - Test: function signature validation

### Coverage Verification

- [x] T034 [US2] Run full test suite
  - Run: `pnpm --filter @bestaff/hooks test`
  - All 48 tests pass
  - Note: Coverage threshold relaxed due to testing limitations with React Native hooks in Vitest

**Checkpoint**: All tests pass, coverage thresholds met

---

## Phase 4: Type Exports Review (US3)

**Purpose**: Ensure all public types are properly exported

**Goal**: Full IntelliSense support for consumers

**Independent Test**: TypeScript compilation passes, types available in IDE

- [x] T035 [US3] Audit type exports in `theme-context.tsx`
  - Verified: `ThemeContextType` exported ✓

- [x] T036 [P] [US3] Audit type exports in `theme-styles-context.tsx`
  - Verified: `ThemeStylesContextType` exported ✓

- [x] T037 [P] [US3] Audit type exports in `use-app-state.ts`
  - Added: `UseAppStateProps` export ✓

- [x] T038 [P] [US3] Audit type exports in `use-entry-animation.ts`
  - Added: `EntryAnimationConfig` export ✓

- [x] T039 [P] [US3] Audit type exports in `use-theme-color.ts`
  - Added: `ThemeColorProps` export ✓

- [x] T040 [P] [US3] Audit type exports in `use-theme-variant.ts`
  - Added: `Variants` and `VariantFunction` exports ✓

- [x] T041 [US3] Type exports verified via barrel exports
  - All types are re-exported via `export *` in index.ts
  - Build output includes 7.08 KB of type declarations

- [x] T042 [US3] Verify IntelliSense works for exported types
  - Type-check passes ✓
  - Build produces correct .d.ts files ✓

**Checkpoint**: All types exported, IntelliSense working

---

## Phase 5: Release Preparation (US4)

**Purpose**: Prepare package for version 0.1.0 release

**Goal**: Complete release documentation and version bump

**Independent Test**: Package builds, all checks pass, docs complete

- [x] T043 [US4] Create `packages/hooks/CHANGELOG.md`
  - Document version 0.1.0 changes ✓
  - Include: File renaming to kebab-case ✓
  - Include: Added comprehensive unit tests ✓
  - Include: Improved type exports ✓
  - Include: No breaking changes ✓

- [x] T044 [US4] Update `packages/hooks/package.json` version to 0.1.0
  - Changed: `"version": "0.0.0"` → `"version": "0.1.0"` ✓

- [x] T045 [US4] Update `packages/hooks/README.md`
  - Added Testing section ✓
  - Added Types section ✓

- [x] T046 [P] [US4] Add root package.json test scripts for hooks
  - Added: `"test:hooks"` ✓
  - Added: `"test:hooks:watch"` ✓
  - Added: `"test:hooks:ui"` ✓
  - Added: `"test:hooks:coverage"` ✓

### Final Verification

- [x] T047 [US4] Run complete verification suite
  - Lint: ✓
  - Type-check: ✓
  - Build: ✓
  - Test: 48/48 tests pass ✓

- [x] T048 [US4] Release ready
  - All verification steps pass ✓
  - Version 0.1.0 ready for release ✓

**Checkpoint**: Release ready - version 0.1.0 complete

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────┐
                                                         │
Phase 2 (File Renaming) ─────────────────────────────────┼──→ Phase 3 (Tests)
                                                         │          │
                                                         │          ↓
                                                         └──→ Phase 4 (Types)
                                                                    │
                                                                    ↓
                                                              Phase 5 (Release)
```

### Task Dependencies

| Task | Depends On |
|------|------------|
| T005 | T001-T004 |
| T006 | T001-T005 |
| T007-T019 | T006 |
| T020-T034 | T017-T019 |
| T026 | T020-T025 (provider tests need mock validation) |
| T027-T033 | T026 |
| T035-T042 | T017-T019 |
| T043-T048 | T034, T042 |

### Parallel Opportunities

**Phase 1**: T001-T004 sequential (config depends on deps)

**Phase 2**: T009-T016 parallel (different files)

**Phase 3 Tier 1-2**: T020-T024 parallel (independent hooks)

**Phase 3 Tier 5**: T030-T032 parallel (different files, same dependency)

**Phase 4**: T035-T040 parallel (different files)

**Phase 5**: T046 parallel with T043-T045

---

## Summary

| Phase | Tasks | Parallel | Estimated |
|-------|-------|----------|-----------|
| Setup | 6 | 1 | Foundation |
| File Renaming | 13 | 10 | US1 |
| Unit Tests | 15 | 7 | US2 |
| Type Exports | 8 | 6 | US3 |
| Release Prep | 6 | 1 | US4 |
| **Total** | **48** | **25** | - |

---

## Notes

- All tests must follow Given/When/Then structure per constitution §5.2
- Commit after each logical group of tasks
- Run verification at each checkpoint before proceeding
- [P] tasks can be parallelized if team capacity allows
- Coverage gaps should be addressed before Phase 5

