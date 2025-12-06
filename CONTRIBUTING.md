# Contributing to BestAff Mobile

Thank you for your interest in contributing to BestAff Mobile! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. Please:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 120.0.0
- **pnpm** 9.15.0 (will be enforced via `packageManager`)
- **Git** for version control
- **VS Code** (recommended) with recommended extensions

### Initial Setup

1. **Fork and clone the repository**

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/bestaff-ai-development/bestaff-mobile.git
cd bestaff-mobile
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up Git hooks**

```bash
# Husky will be automatically installed
# This sets up pre-commit and commit-msg hooks
```

4. **Verify installation**

```bash
# Run type checking
pnpm check-types

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 💻 Development Workflow

### 1. Create a New Branch

Always create a new branch for your changes:

```bash
# For new features
git checkout -b feat/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/documentation-update

# For refactoring
git checkout -b refactor/code-improvement
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint

# Fix linting issues
pnpm lint-fix

# Format code
pnpm format:fix

# Run tests
pnpm test

# Run E2E tests (if applicable)
pnpm e2e
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```bash
# Format: <type>(<scope>): <description>

# Examples:
git commit -m "feat(auth): add login functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs(readme): update installation guide"
git commit -m "refactor(utils): optimize error handling"
git commit -m "test(auth): add login tests"
git commit -m "chore(deps): update dependencies"
```

**Commit will be automatically validated** by Commitlint.

### 5. Push and Create Pull Request

```bash
# Push your branch
git push origin your-branch-name

# Create a Pull Request on GitHub
```

## 📝 Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript
- **Type everything explicitly** - Avoid `any`
- **Use interfaces for objects** - Prefer interfaces over types for object shapes
- **Export types** - Make reusable types available

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ id, name, email }: UserProps) {
  // ...
}

// ❌ Avoid
function UserProfile(props: any) {
  // ...
}
```

### React Components

- **Use functional components** - No class components
- **Use hooks** - useState, useEffect, custom hooks
- **Prop types** - Always define prop interfaces
- **Naming** - PascalCase for components, camelCase for functions

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ title, onPress, disabled }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </Pressable>
  );
}

// ❌ Avoid
export default function button(props) {
  return <Pressable onPress={props.onPress}>{props.title}</Pressable>;
}
```

### File Organization

- **One component per file** - Easier to maintain
- **Consistent naming** - Match file name to component name
- **Co-locate tests** - Place tests near source files
- **Index exports** - Use `index.ts` for clean imports

```
components/
├── button/
│   ├── button.tsx           # Component
│   ├── button.test.tsx      # Tests
│   └── index.ts             # Export
└── card/
    ├── card.tsx
    └── index.ts
```

### Styling

- **Use theme tokens** - From `@bestaff/theme`
- **Consistent spacing** - Use `spacing` from theme
- **Type-safe styles** - Use StyleSheet.create
- **Avoid inline styles** - Create separate style objects

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});

// ❌ Avoid
<View style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
```

### Imports

- **Absolute imports** - Use path aliases
- **Group imports** - External, internal, relative
- **Sort imports** - Alphabetically within groups

```typescript
// ✅ Good - Organized imports
// External dependencies
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Internal packages
import { useTheme } from '@bestaff/theme';
import { Button } from '@bestaff/ui/button';

// Relative imports
import { useAuth } from './hooks/use-auth';
import { styles } from './styles';

// ❌ Avoid - Messy imports
import { styles } from './styles';
import React, { useState } from 'react';
import { Button } from '@bestaff/ui/button';
import { View } from 'react-native';
```

## 🔖 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only
- **style**: Code style changes (formatting, missing semi colons, etc)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (updating deps, configs, etc)
- **ci**: CI/CD changes
- **build**: Build system changes

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Examples

```bash
# Simple commit
feat(auth): add password reset functionality

# With scope
fix(ui/button): resolve disabled state styling

# With body
refactor(utils): optimize platform detection

Split platform checks into separate utilities
for better tree-shaking and readability

# Breaking change
feat(theme)!: restructure color tokens

BREAKING CHANGE: Color token names have changed.
Migration guide:
- primary -> colors.primary
- secondary -> colors.secondary
```

### Scope Guidelines

- `auth` - Authentication features
- `ui` - UI components
- `theme` - Theme and styling
- `utils` - Utility functions
- `logger` - Logging infrastructure
- `e2e` - E2E tests
- `docs` - Documentation
- `deps` - Dependencies

## 🔄 Pull Request Process

### Before Submitting

1. ✅ **All tests pass**
2. ✅ **Code is linted and formatted**
3. ✅ **Types check successfully**
4. ✅ **Documentation is updated**
5. ✅ **Commits follow convention**

### PR Title

Use the same convention as commits:

```
feat(auth): add biometric authentication
fix(ui): resolve modal overlay issue
docs(readme): update contribution guide
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- List of significant changes
- Another change
- etc.

## Testing

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
```

### Review Process

1. **Automated checks** - Must pass CI/CD
2. **Code review** - At least one approval required
3. **Testing** - Reviewers test changes
4. **Discussions** - Address feedback
5. **Merge** - Squash and merge (typically)

## 📁 Project Structure

```
bestaff-mobile/
├── apps/
│   └── mobile-app/          # Main application
├── packages/
│   ├── theme/               # Design system
│   ├── ui/                  # UI components
│   ├── utils/               # Utilities
│   ├── logger/              # Logging
│   ├── eslint-config/       # ESLint config
│   ├── prettier-config/     # Prettier config
│   └── typescript-config/   # TypeScript config
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

### Adding New Packages

Use Turborepo generators:

```bash
# Generate new package
pnpm turbo gen

# Follow prompts to create package structure
```

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react-native';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button title="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Click me" onPress={onPress} />);

    fireEvent.press(screen.getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

Place E2E tests in `e2e/` directory using Maestro:

```yaml
# e2e/flows/login.yml
appId: com.bestaff.mobile
---
- launchApp
- tapOn: 'Log In'
- inputText: 'user@example.com'
- tapOn: 'Password'
- inputText: 'password123'
- tapOn: 'Submit'
- assertVisible: 'Welcome'
```

## 🐛 Reporting Bugs

Use GitHub Issues with this template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**

1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**

- OS: [e.g., iOS 17, Android 14]
- App Version: [e.g., 1.0.0]
- Device: [e.g., iPhone 15 Pro]
```

## ✨ Feature Requests

Use GitHub Issues:

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches considered
```

## 📚 Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

For questions or discussions:

- Create a GitHub Discussion
- Reach out to maintainers
- Check existing documentation

---

Thank you for contributing to BestAff Mobile! 🎉
