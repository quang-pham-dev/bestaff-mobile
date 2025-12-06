# Bestaff Mobile App

## Repository Overview

This is a **monorepo** for Bestaff mobile application built with Expo and managed using Turborepo.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | [Expo](https://docs.expo.dev/) SDK 54 |
| Language | TypeScript 5.9 |
| UI | React 19, React Native 0.81 |
| Navigation | React Navigation 7 |
| State Management | TanStack Query |
| Form Handling | React Hook Form + Zod |
| Monorepo | Turborepo |
| Package Manager | pnpm 9.15+ |
| Testing | Jest, Testing Library, Maestro (E2E) |

## Directory Structure

```
bestaff-mobile/
├── apps/
│   ├── mobile-app/          # Main production mobile app
│   └── mobile-storybook/    # Storybook for UI component development
├── packages/
│   ├── hooks/               # Shared React hooks
│   ├── logger/              # Logging utilities
│   ├── theme/               # Theme configuration & tokens
│   ├── ui/                  # Shared UI component library
│   └── utils/               # Common utility functions
├── tooling/
│   ├── eslint-config/       # Shared ESLint configurations
│   ├── prettier-config/     # Shared Prettier configurations
│   └── typescript-config/   # Shared TypeScript configurations
├── turbo/                   # Turborepo generators
├── docs/                    # Project documentation
└── scripts/                 # Build & automation scripts
```

## Development Workflow

### Prerequisites

- Node.js >= 20
- pnpm 9.15+
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development (all packages)
pnpm dev

# Start mobile app only
pnpm dev:mobile

# Start storybook
pnpm dev:storybook
```

### Common Commands

#### Development
| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development for all packages |
| `pnpm dev:mobile` | Start mobile app development |
| `pnpm dev:storybook` | Start Storybook development |
| `pnpm dev:packages` | Start all packages in watch mode |

#### Mobile App (from root)
| Command | Description |
|---------|-------------|
| `pnpm mobile:start` | Start Expo dev server |
| `pnpm mobile:ios` | Run on iOS simulator |
| `pnpm mobile:ios:prod` | Run production build on iOS |
| `pnpm mobile:android` | Run on Android emulator |
| `pnpm mobile:android:prod` | Run production build on Android |
| `pnpm mobile:web` | Run on web browser |
| `pnpm mobile:prebuild` | Generate native projects |
| `pnpm mobile:fix-deps` | Fix Expo dependencies |
| `pnpm mobile:export` | Export for deployment |

#### Storybook (from root)
| Command | Description |
|---------|-------------|
| `pnpm storybook:start` | Start Storybook |
| `pnpm storybook:ios` | Run Storybook on iOS |
| `pnpm storybook:android` | Run Storybook on Android |
| `pnpm storybook:web` | Run Storybook on web |

#### Build
| Command | Description |
|---------|-------------|
| `pnpm build` | Build all packages |
| `pnpm build:apps` | Build apps only |
| `pnpm build:packages` | Build packages only |
| `pnpm build:mobile` | Build mobile app |

#### Testing
| Command | Description |
|---------|-------------|
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm test:mobile` | Run mobile app tests |
| `pnpm test:logger` | Run logger package tests |
| `pnpm test:logger:ui` | Run logger tests with UI |
| `pnpm test:logger:coverage` | Run logger tests with coverage |
| `pnpm e2e` | Run E2E tests with Maestro |
| `pnpm e2e:mobile` | Run mobile E2E tests |

#### Code Quality
| Command | Description |
|---------|-------------|
| `pnpm lint` | Run ESLint on all packages |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm lint:mobile` | Lint mobile app only |
| `pnpm lint:packages` | Lint packages only |
| `pnpm format` | Check formatting with Prettier |
| `pnpm format:fix` | Fix formatting issues |
| `pnpm check-types` | Run TypeScript type checking |

#### Package Builds
| Command | Description |
|---------|-------------|
| `pnpm pkg:ui:build` | Build UI package |
| `pnpm pkg:hooks:build` | Build hooks package |
| `pnpm pkg:theme:build` | Build theme package |
| `pnpm pkg:utils:build` | Build utils package |
| `pnpm pkg:logger:build` | Build logger package |

#### Generators & Cleanup
| Command | Description |
|---------|-------------|
| `pnpm generate:component` | Generate new component |
| `pnpm codegen` | Run code generation |
| `pnpm clean` | Clean all (including node_modules) |
| `pnpm clean:workspaces` | Clean workspaces only |
| `pnpm clean:turbo` | Clean turbo cache |

#### Release
| Command | Description |
|---------|-------------|
| `pnpm changeset` | Create a changeset |
| `pnpm version-packages` | Version packages |
| `pnpm release` | Full release workflow |

## Code Quality Tools

- **ESLint**: Shared config in `tooling/eslint-config/`
- **Prettier**: Shared config in `tooling/prettier-config/`
- **TypeScript**: Shared config in `tooling/typescript-config/`
- **Husky + lint-staged**: Pre-commit hooks for code quality
- **Commitlint**: Conventional commit message enforcement
