# BeStaff Mobile Monorepo

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020)](https://expo.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.6-EF4444)](https://turbo.build/)
[![pnpm](https://img.shields.io/badge/pnpm-9.15-F69220)](https://pnpm.io/)

A modern, scalable React Native mobile application built with Expo and managed as a monorepo using Turborepo.

[Features](#features) •
[Getting Started](#getting-started) •
[Architecture](#architecture) •
[Development](#development) •
[Contributing](#contributing)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

BestAff Mobile is a production-ready React Native mobile application built with modern best practices, featuring:

- **Monorepo Architecture**: Managed with Turborepo for optimal build caching and task orchestration
- **Type Safety**: Full TypeScript coverage across the entire codebase
- **Consistent Styling**: Centralized theme system with design tokens
- **Production Logging**: Comprehensive logging infrastructure with Pino
- **Developer Experience**: Hot reload, ESLint, Prettier, Husky, and Commitlint pre-configured

## ✨ Features

- 🚀 **Fast**: Turborepo build caching for lightning-fast builds
- 📱 **Cross-Platform**: iOS, Android, and Web support via Expo
- 🎨 **Design System**: Centralized theme and UI components
- 🔧 **Developer Tools**: Code generation, linting, formatting, and type checking
- 📊 **Logging**: Production-ready logging with structured output
- 🧪 **Testing**: Unit testing with Jest/Vitest and E2E testing with Maestro
- 🔄 **CI/CD**: Automated workflows with lint-staged and Husky hooks

## 🛠 Tech Stack

### Core

| Technology | Version | Description |
|------------|---------|-------------|
| [React Native](https://reactnative.dev/) | 0.81 | Mobile framework |
| [Expo](https://expo.dev/) | 54.0 | Development platform |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety |
| [Turborepo](https://turbo.build/) | 2.6 | Monorepo build system |
| [pnpm](https://pnpm.io/) | 9.15 | Package manager |

### State Management & Data

- **[TanStack Query v5](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod v4](https://zod.dev/)** - Schema validation

### Navigation & UI

- **[Expo Router 6](https://docs.expo.dev/router/introduction/)** - File-based routing
- **[React Navigation 7](https://reactnavigation.org/)** - Navigation primitives
- **[Reanimated 4](https://docs.swmansion.com/react-native-reanimated/)** - Animations

### Development Tools

- **[ESLint 9](https://eslint.org/)** - Code linting
- **[Prettier 3](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Commitlint](https://commitlint.js.org/)** - Commit message linting
- **[Vitest](https://vitest.dev/)** - Unit testing for packages
- **[Jest](https://jestjs.io/)** - Unit testing for apps

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20.0.0 (recommended: v20.14.0)
- **pnpm** 9.15.0 (automatically used via `packageManager` field)
- **iOS**: Xcode 15+ (for iOS development)
- **Android**: Android Studio with Android SDK (for Android development)

### Installation

1. **Clone the repository**

```bash
git clone git@github.com:quang-pham-dev/bestaff-mobile.git
cd bestaff-mobile
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start development**

```bash
# Start all packages in watch mode
pnpm dev

# Start mobile app only
pnpm dev:mobile

# Run on specific platform (from root)
pnpm mobile:ios
pnpm mobile:android
pnpm mobile:web
```

### Quick Commands

#### Development

```bash
pnpm dev                 # Start all packages in watch mode
pnpm dev:mobile          # Start mobile app development
pnpm dev:storybook       # Start Storybook development
pnpm dev:packages        # Start packages in watch mode
```

#### Mobile App (from root)

```bash
pnpm mobile:start        # Start Expo dev server
pnpm mobile:ios          # Run on iOS simulator
pnpm mobile:ios:prod     # Run production build on iOS
pnpm mobile:android      # Run on Android emulator
pnpm mobile:android:prod # Run production build on Android
pnpm mobile:web          # Run on web browser
pnpm mobile:prebuild     # Generate native projects
pnpm mobile:fix-deps     # Fix Expo dependencies
pnpm mobile:export       # Export for deployment
```

#### Build

```bash
pnpm build               # Build all packages
pnpm build:apps          # Build apps only
pnpm build:packages      # Build packages only
pnpm build:mobile        # Build mobile app
```

#### Code Quality

```bash
pnpm lint                # Lint all packages
pnpm lint:fix            # Fix linting issues
pnpm lint:mobile         # Lint mobile app only
pnpm lint:packages       # Lint packages only
pnpm format              # Check code formatting
pnpm format:fix          # Fix formatting issues
pnpm check-types         # TypeScript type checking
```

#### Testing

```bash
pnpm test                # Run all tests
pnpm test:watch          # Run tests in watch mode
pnpm test:coverage       # Run tests with coverage
pnpm test:mobile         # Run mobile app tests
pnpm test:logger         # Run logger package tests
pnpm test:logger:ui      # Run logger tests with Vitest UI
pnpm test:logger:coverage # Run logger tests with coverage
pnpm e2e                 # Run E2E tests
pnpm e2e:mobile          # Run mobile E2E tests
```

#### Package Builds

```bash
pnpm pkg:ui:build        # Build UI package
pnpm pkg:hooks:build     # Build hooks package
pnpm pkg:theme:build     # Build theme package
pnpm pkg:utils:build     # Build utils package
pnpm pkg:logger:build    # Build logger package
```

#### Utilities

```bash
pnpm clean               # Clean all (including node_modules)
pnpm clean:workspaces    # Clean workspaces only
pnpm clean:turbo         # Clean turbo cache
pnpm generate:component  # Generate new component
pnpm codegen             # Run code generation
```

## 📁 Project Structure

```
bestaff-mobile/
├── apps/
│   ├── mobile-app/           # Main React Native application
│   └── mobile-storybook/     # Storybook for component development
├── packages/
│   ├── hooks/                # Shared React hooks
│   ├── logger/               # Production logging infrastructure
│   ├── theme/                # Design system and tokens
│   ├── ui/                   # Shared UI component library
│   └── utils/                # Shared utility functions
├── tooling/
│   ├── eslint-config/        # Shared ESLint configurations
│   ├── prettier-config/      # Shared Prettier configurations
│   └── typescript-config/    # Shared TypeScript configurations
├── turbo/                    # Turborepo generators
├── docs/                     # Project documentation
├── scripts/                  # Build and deployment scripts
├── .husky/                   # Git hooks configuration
└── turbo.json               # Turborepo configuration
```

### Apps

| App | Description |
|-----|-------------|
| [mobile-app](./apps/mobile-app) | Main React Native application with Expo |
| [mobile-storybook](./apps/mobile-storybook) | Component development and documentation |

### Packages

| Package | Description |
|---------|-------------|
| [@bestaff/hooks](./packages/hooks) | Shared React hooks (useTheme, useDebounce, useColorScheme, etc.) |
| [@bestaff/theme](./packages/theme) | Design system, tokens, and theme configuration |
| [@bestaff/ui](./packages/ui) | Shared React Native UI components |
| [@bestaff/utils](./packages/utils) | Shared utility functions |
| [@bestaff/logger](./packages/logger) | Production logging infrastructure with Pino |

### Tooling

| Package | Description |
|---------|-------------|
| [@bestaff/eslint-config](./tooling/eslint-config) | Shared ESLint rules |
| [@bestaff/prettier-config](./tooling/prettier-config) | Shared Prettier configuration |
| [@bestaff/typescript-config](./tooling/typescript-config) | Shared TypeScript configurations |

## 💻 Development

### Running the Mobile App

```bash
# From root - recommended
pnpm dev:mobile          # Start with turbo watch
pnpm mobile:ios          # Run on iOS
pnpm mobile:android      # Run on Android

# From apps/mobile-app directory
cd apps/mobile-app
pnpm start               # Start Expo dev server
pnpm ios                 # Run on iOS
pnpm android             # Run on Android
pnpm web                 # Run on Web
```

### Building Packages

Packages are automatically built when needed, but you can build them manually:

```bash
# Build all packages
pnpm build:packages

# Build specific package
pnpm pkg:ui:build
pnpm pkg:theme:build
pnpm pkg:hooks:build
pnpm pkg:utils:build
pnpm pkg:logger:build
```

### Adding New Packages

Use Turborepo generators to scaffold new packages:

```bash
pnpm turbo gen
```

### Code Generation

```bash
# Generate React components
pnpm generate:component
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific package tests
pnpm test:logger
pnpm test:logger:ui      # With Vitest UI
pnpm test:logger:coverage
```

### E2E Tests

E2E tests use [Maestro](https://maestro.mobile.dev/) for mobile testing:

```bash
# Run all E2E tests
pnpm e2e

# Run mobile E2E tests
pnpm e2e:mobile
```

## 📦 Deployment

### Building for Production

```bash
# Generate native projects
pnpm mobile:prebuild

# Build for Android (production)
pnpm mobile:android:prod

# Build for iOS (production)
pnpm mobile:ios:prod

# Export for deployment
pnpm mobile:export
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform android
eas build --platform ios
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Create a new branch from `develop`
2. Make your changes
3. Ensure tests pass and code is linted
4. Commit using conventional commits
5. Submit a pull request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

Commits are validated using Commitlint and Husky.

## 📝 Documentation

- [Architecture Overview](./docs/ARCHITECHTURE.md)
- [Release Guide](./docs/RELEASE.md)
- [Mobile App Documentation](./apps/mobile-app/README.md)
- [Theme Package](./packages/theme/README.md)
- [Hooks Package](./packages/hooks/README.md)
- [Logger Package](./packages/logger/README.md)
- [UI Components](./packages/ui/README.md)
- [Utilities](./packages/utils/README.md)

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# App Configuration
APP_ENV=development
EXPO_PUBLIC_API_URL=https://api.example.com

# Feature Flags
ENABLE_ANALYTICS=false
```

### Workspace Configuration

| File | Description |
|------|-------------|
| `pnpm-workspace.yaml` | Workspace packages and catalog dependencies |
| `turbo.json` | Turborepo pipeline configuration |
| `.nvmrc` | Node.js version (v20.14.0) |
| `.npmrc` | pnpm configuration |

## 📊 Performance

This monorepo uses Turborepo for optimal performance:

- **Build Caching**: Avoid rebuilding unchanged packages
- **Parallel Execution**: Run tasks across packages simultaneously
- **Incremental Builds**: Only rebuild what changed
- **Remote Caching**: Share cache across team and CI (optional)

## 🐛 Troubleshooting

### Common Issues

**Node modules issues**

```bash
pnpm clean
pnpm install
```

**Type checking errors**

```bash
pnpm check-types
```

**Build cache issues**

```bash
pnpm clean:turbo
pnpm build
```

**Expo dependency issues**

```bash
pnpm mobile:fix-deps
```

**Metro bundler issues**

```bash
cd apps/mobile-app
rm -rf node_modules/.cache/metro
pnpm start --clear
```

## 📚 Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [pnpm Documentation](https://pnpm.io/)

## 📄 License

Copyright © 2025 Quang Pham. All rights reserved.

---

<div align="center">
Made with ❤️ by the BeStaff Team
</div>
