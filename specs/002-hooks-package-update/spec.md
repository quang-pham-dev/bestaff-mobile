# Feature Specification: @bestaff/hooks Package Update

**Feature Branch**: `002-hooks-package-update`  
**Created**: 2025-12-07  
**Status**: Draft  
**Input**: Update @bestaff/hooks package - kebab-case file naming convention, add comprehensive unit tests, review types, ensure API stability, negligible performance overhead, target patch/minor version bump.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent File Naming Convention (Priority: P1)

As a developer working on the @bestaff/hooks package, I want all hook files to follow kebab-case naming convention so that the codebase maintains consistency with modern JavaScript/TypeScript best practices.

**Why this priority**: Naming consistency is foundational for maintainability. This change enables cleaner imports and aligns with community standards. All other changes depend on this refactoring being completed first.

**Independent Test**: Can be fully tested by verifying all hook files are renamed to kebab-case format and all imports/exports are updated accordingly without breaking the build.

**Acceptance Scenarios**:

1. **Given** a hook file named `ThemeContext.tsx`, **When** the refactoring is applied, **Then** it should be renamed to `theme-context.tsx` with all internal and external imports updated.
2. **Given** a hook file named `useDebounce.ts`, **When** the refactoring is applied, **Then** it should be renamed to `use-debounce.ts` while maintaining the same export API.
3. **Given** any dependent package imports from @bestaff/hooks, **When** the refactoring is complete, **Then** all imports should work without modification (API surface remains stable).

---

### User Story 2 - Comprehensive Unit Test Coverage (Priority: P1)

As a package maintainer, I want all hooks to have comprehensive unit tests so that I can confidently release updates knowing the functionality is verified.

**Why this priority**: Tests are critical for ensuring stability during the file renaming and any future changes. Co-equal priority with US1 as both are essential for a quality release.

**Independent Test**: Can be fully tested by running the test suite and achieving target coverage metrics for all hook functions.

**Acceptance Scenarios**:

1. **Given** the useTheme hook, **When** unit tests are executed, **Then** tests should cover: normal usage, error when used outside provider, and all return values.
2. **Given** the useDebounce hook, **When** unit tests are executed, **Then** tests should cover: immediate value return, debounced value after delay, value updates, and edge cases (0 delay, negative delay, rapid value changes).
3. **Given** all hooks in the package, **When** the test suite runs, **Then** each hook should have tests for normal paths, error paths, and boundary conditions.

---

### User Story 3 - Type Safety and Export Consistency (Priority: P2)

As a TypeScript developer consuming @bestaff/hooks, I want all hooks to have proper type exports so that I get full IntelliSense support and type safety.

**Why this priority**: Type exports enhance developer experience and prevent runtime errors. Important but secondary to core functionality and testing.

**Independent Test**: Can be fully tested by verifying TypeScript compilation passes without errors and all public types are properly exported.

**Acceptance Scenarios**:

1. **Given** the ThemeContextType interface, **When** a consumer imports from @bestaff/hooks, **Then** the type should be available and correctly typed.
2. **Given** any hook with custom types (UseAppStateProps, EntryAnimationConfig, etc.), **When** a consumer uses the hook, **Then** TypeScript should provide full autocomplete and type checking.
3. **Given** the package exports, **When** reviewing index.ts, **Then** all public types, interfaces, and hooks should be properly exported.

---

### User Story 4 - Package Version Bump and Release Preparation (Priority: P3)

As a package maintainer, I want to properly version and document the release so that consumers can understand what changed and safely upgrade.

**Why this priority**: Essential for release but depends on all other changes being complete.

**Independent Test**: Can be fully tested by verifying package.json version is updated, CHANGELOG is present, and README reflects current API.

**Acceptance Scenarios**:

1. **Given** file renaming is internal with stable API, **When** determining version bump, **Then** it should be a minor version bump (0.1.0) since this adds features (tests, better types) without breaking changes.
2. **Given** the release preparation, **When** complete, **Then** CHANGELOG.md should document all changes in the release.
3. **Given** the README.md, **When** reviewed, **Then** it should accurately reflect the current hooks API and usage examples.

---

### Edge Cases

- What happens when a hook is used outside its required provider? → Should throw a descriptive error.
- How does useDebounce handle very rapid value changes? → Should only return the final debounced value.
- What happens when useAppState receives invalid regex? → Should handle gracefully or throw clear error.
- What happens when useTheme is used before ThemeProvider mounts? → Should throw clear error message.
- How does useIsFirstTime handle storage failures? → Should fallback to default behavior with warning.

## Requirements *(mandatory)*

### Functional Requirements

#### File Naming Convention

- **FR-001**: All hook files MUST be renamed from PascalCase/camelCase to kebab-case format.
- **FR-002**: The index.ts barrel export file MUST be updated with new file paths while maintaining the same export API.
- **FR-003**: Internal import references between hooks MUST be updated to use new kebab-case paths.
- **FR-004**: The package.json exports field MUST be updated if necessary to support new file naming.

#### Unit Testing

- **FR-005**: Each hook MUST have a dedicated test file following the pattern `[hook-name].test.ts(x)`.
- **FR-006**: Tests MUST cover normal usage paths for each hook.
- **FR-007**: Tests MUST cover error scenarios (e.g., usage outside providers, invalid inputs).
- **FR-008**: Tests MUST cover boundary conditions (empty values, null, maximum values where applicable).
- **FR-009**: Tests MUST use React Testing Library with renderHook for hook testing.
- **FR-010**: Tests MUST properly mock React Native dependencies (AsyncStorage, Appearance, AppState, BackHandler, etc.).
- **FR-011**: Tests MUST properly mock Expo dependencies (expo-haptics, expo-secure-store).

#### Type Exports

- **FR-012**: All public interfaces and types MUST be exported from the package.
- **FR-013**: Hook return types MUST be explicitly defined and exported where beneficial.
- **FR-014**: Type definitions MUST use TypeScript strict mode compatibility.

#### API Stability

- **FR-015**: All existing public exports MUST remain available and unchanged.
- **FR-016**: Hook signatures (parameters and return types) MUST remain backward compatible.
- **FR-017**: No breaking changes to existing consumer code.

#### Performance

- **FR-018**: File renaming and test additions MUST NOT impact runtime performance.
- **FR-019**: Hooks MUST continue to use proper memoization (useMemo, useCallback) where applicable.
- **FR-020**: No additional re-renders should be introduced by any changes.

#### Package Release

- **FR-021**: Package version MUST be bumped appropriately (minor for new features/improvements).
- **FR-022**: A CHANGELOG.md entry MUST document all changes in this release.
- **FR-023**: README.md MUST reflect current API and usage.

### Key Entities

- **Hook**: A reusable React hook function exported from the package (16 hooks total).
- **Provider**: React context provider components (ThemeProvider, ThemeStylesProvider).
- **Type Export**: TypeScript interface or type exported for consumer usage.
- **Test File**: Jest/Vitest test file for a specific hook.

### Files to Rename

| Current Name | New Name (kebab-case) |
|--------------|----------------------|
| ThemeContext.tsx | theme-context.tsx |
| ThemeStylesContext.tsx | theme-styles-context.tsx |
| useColorScheme.ts | use-color-scheme.ts |
| useDebounce.ts | use-debounce.ts |
| useEntryAnimation.ts | use-entry-animation.ts |
| useTheme.ts | use-theme.ts |
| useThemeColor.ts | use-theme-color.ts |
| useThemeStyles.ts | use-theme-styles.ts |
| useThemeValue.ts | use-theme-value.ts |
| useThemeVariant.ts | use-theme-variant.ts |
| constants.ts | constants.ts (already valid) |
| use-app-state.ts | use-app-state.ts (already valid) |
| use-back-handler.ts | use-back-handler.ts (already valid) |
| use-haptics.ts | use-haptics.ts (already valid) |
| use-is-first-time.ts | use-is-first-time.ts (already valid) |
| index.ts | index.ts (already valid) |

### Hooks Test Coverage Requirements

| Hook | Test Areas |
|------|------------|
| ThemeContext/ThemeProvider | Provider rendering, context value, theme toggle, setThemeMode, AsyncStorage persistence, system theme sync |
| ThemeStylesContext/Provider | Provider rendering, styles generation, StyleUtils creation |
| useTheme | Normal usage, error outside provider |
| useThemeStyles | Normal usage, error outside provider |
| useThemeColor | Light/dark color selection, props override, fallback to theme colors |
| useThemeValue | Selector execution, memoization |
| useThemeVariant | Variant selection, invalid variant error |
| useDebounce | Immediate return, debounced value, rapid updates, edge cases (0 delay) |
| useAppState | State change detection, callback execution, subscription cleanup |
| useBackHandler | Subscription setup, callback execution, cleanup |
| useHaptics | All haptic functions return correctly |
| useIsFirstTime | Initial state, state persistence, error handling |
| useEntryAnimation | Animation style generation, different types (fade, slide, both) |
| useColorScheme | Re-export verification |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of hook files follow kebab-case naming convention after refactoring.
- **SC-002**: All existing consumers of @bestaff/hooks can upgrade without code changes (API stability verified).
- **SC-003**: Unit test coverage reaches at least 80% for lines and 70% for branches across all hooks.
- **SC-004**: All hooks have at least one test for normal path, one for error path, and one for edge case.
- **SC-005**: TypeScript compilation passes with zero errors in strict mode.
- **SC-006**: Package builds successfully with `pnpm build` command.
- **SC-007**: All tests pass with `pnpm test` command.
- **SC-008**: No runtime performance degradation (bundle size increase < 1KB, no additional runtime overhead).
- **SC-009**: Package version incremented to 0.1.0 (from 0.0.0).
- **SC-010**: CHANGELOG.md documents all changes made in this release.

## Assumptions

- Jest with React Testing Library will be used for testing (consistent with mobile-app package).
- Mock implementations for React Native and Expo modules are acceptable for unit testing.
- The current API surface is intentional and should be preserved.
- Performance metrics can be verified through bundle size comparison and code review.
- The package is internal (private: true), so semver adherence is for internal consistency.
