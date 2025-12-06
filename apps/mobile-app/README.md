# BestAff Mobile App

<div align="center">

[![Expo](https://img.shields.io/badge/Expo-54.0-000020)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

The main React Native application for BestAff, built with Expo and modern best practices.

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Configuration](#configuration)

## 🎯 About

BestAff Mobile is a cross-platform mobile application that provides [describe your app's main purpose]. Built with React Native and Expo, it delivers a native experience on both iOS and Android platforms.

### Key Highlights

- 🚀 **Expo SDK 54** with latest React Native features
- 📱 **File-based Routing** with Expo Router 6
- 🎨 **Consistent Design** using shared `@bestaff/theme` and `@bestaff/ui`
- 🔄 **Server State** managed with TanStack Query v5
- 🌐 **Deep Linking** support for navigation
- 🧪 **E2E Testing** with Maestro
- 📊 **Type-safe** forms with React Hook Form + Zod

## ✨ Features

### Core Features

- [ ] User Authentication
- [ ] Profile Management
- [ ] [Add your app's specific features]

### Technical Features

- ✅ **Cross-Platform**: iOS, Android, and Web support
- ✅ **Dark Mode**: Built-in theme switching
- ✅ **Offline Support**: Local data persistence with AsyncStorage
- ✅ **Push Notifications**: Expo Notifications integration
- ✅ **Deep Linking**: Universal linking support
- ✅ **Internationalization**: Multi-language support with react-i18next
- ✅ **Haptic Feedback**: Enhanced user experience
- ✅ **Optimized Images**: Expo Image for better performance

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0
- Expo CLI (installed automatically)
- iOS: Xcode 14+ and iOS Simulator
- Android: Android Studio and Android Emulator

### Installation

1. **Install dependencies**

```bash
# From monorepo root
pnpm install

# Or from this directory
cd apps/mobile-app
pnpm install
```

2. **Start the development server**

```bash
pnpm start
```

3. **Run on a specific platform**

```bash
# iOS Simulator (macOS only)
pnpm ios

# Android Emulator/Device
pnpm android

# Web Browser
pnpm web
```

### Development with Expo Go

For quick development and testing:

1. Install [Expo Go](https://expo.dev/client) on your device
2. Run `pnpm start`
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)

### Development with Development Build

For production-like development:

```bash
# Create development build
pnpm prebuild

# Run with development client
pnpm start:dev-client
```

## 📁 Project Structure

```
mobile-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigator screens
│   │   ├── _layout.tsx   # Tab layout configuration
│   │   ├── index.tsx     # Home screen
│   │   └── explore.tsx   # Explore screen
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screens
├── assets/                # Static assets (images, fonts)
│   └── index.ts          # Asset exports
├── components/            # React components
│   ├── ui/               # UI components
│   │   ├── collapsible.tsx
│   │   └── icon-symbol.tsx
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/             # App constants
│   └── theme.ts          # Theme constants
├── hooks/                 # Custom React hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── e2e/                   # End-to-end tests
│   ├── config.yaml
│   └── flows/
│       └── deeplinks.yml
├── scripts/               # Build scripts
│   └── reset-project.js
├── app.config.ts          # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json
```

### Directory Explanation

#### `app/` - Application Screens

Expo Router uses file-based routing. The folder structure directly maps to navigation:

- `app/(tabs)/` - Tab navigation group
- `app/_layout.tsx` - Root layout wrapper
- `app/modal.tsx` - Modal screens

#### `components/` - React Components

Organized by feature and type:

- `ui/` - Reusable UI components
- Feature-specific components at root level

#### `assets/` - Static Assets

Images, fonts, and other static files:

- Images: PNG, SVG, WebP
- Fonts: TTF, OTF
- All exports centralized in `index.ts`

#### `hooks/` - Custom Hooks

Reusable React hooks for:

- Theme management
- Platform-specific behavior
- State management

#### `e2e/` - End-to-End Tests

Maestro test flows for critical user journeys.

## 💻 Development

### Available Scripts

```bash
# Development
pnpm start              # Start Expo development server
pnpm start:dev-client   # Start with development build
pnpm start:prod         # Start in production mode

# Platform-specific
pnpm ios                # Run on iOS simulator
pnpm ios:prod          # Run iOS in production mode
pnpm android            # Run on Android emulator
pnpm android:prod      # Run Android in production mode
pnpm web                # Run on web browser

# Build
pnpm prebuild           # Generate native projects
pnpm build              # Export for distribution

# Testing
pnpm test               # Run unit tests
pnpm e2e                # Run E2E tests

# Code Quality
pnpm lint               # Lint code
pnpm format             # Check formatting
pnpm format:fix         # Fix formatting

# Utilities
pnpm fix-deps           # Fix Expo dependencies
pnpm reset-project      # Reset to template
pnpm clean              # Clean node_modules
```

### Adding New Screens

1. **Create a new file in `app/`**

```tsx
// app/profile.tsx
export default function ProfileScreen() {
  return <View>{/* Your screen content */}</View>;
}
```

2. **Add to navigation** (if using custom navigator)

The file will be automatically available at `/profile` route.

### Adding New Components

1. **Create component file**

```tsx
// components/my-component.tsx
export function MyComponent() {
  return <ThemedView>{/* Component content */}</ThemedView>;
}
```

2. **Export from index** (if needed)

```tsx
// components/index.ts
export { MyComponent } from './my-component';
```

### Using Shared Packages

```tsx
// Import from theme package
import { darkTheme, lightTheme } from '@bestaff/theme';
// Import from UI package
import { Button } from '@bestaff/ui/button';
// Import from utils package
import { isAndroid, isIOS } from '@bestaff/utils/platform';
```

### Environment Variables

Create `.env` file in the app root:

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_API_KEY=your_api_key

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=false
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
```

Access in code:

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test -- --watchAll=false
```

### E2E Tests with Maestro

```bash
# Start the app
pnpm start

# Run E2E tests
pnpm e2e
```

### Test Structure

```typescript
// __tests__/component.test.tsx
import { render, screen } from '@testing-library/react-native';
import { MyComponent } from '../components/my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

## 🏗 Building

### Development Build

```bash
# Generate native projects
pnpm prebuild

# Build for iOS
pnpm ios

# Build for Android
pnpm android
```

### Production Build with EAS

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Configure project
eas build:configure

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

### Build Profiles

Configured in `eas.json`:

- **development** - Development build with dev tools
- **preview** - Internal testing builds
- **production** - Production builds for stores

## ⚙️ Configuration

### `app.config.ts`

Main Expo configuration file:

```typescript
export default {
  expo: {
    name: 'mobile-app',
    slug: 'mobile-app',
    version: '1.0.0',
    // ... other configuration
  },
};
```

### `eas.json`

EAS Build configuration:

```json
{
  "build": {
    "development": {},
    "preview": {},
    "production": {}
  }
}
```

### Deep Linking

Configure in `app.config.ts`:

```typescript
{
  scheme: 'bestaff',
  web: {
    bundler: 'metro',
    output: 'static',
  },
}
```

## 📱 Platform-Specific Code

### Using Platform Module

```tsx
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 },
      web: { paddingTop: 0 },
    }),
  },
});
```

### File Extensions

- `.ios.tsx` - iOS-specific
- `.android.tsx` - Android-specific
- `.web.tsx` - Web-specific
- `.native.tsx` - iOS and Android

## 🔧 Troubleshooting

### Common Issues

**Metro bundler issues**

```bash
# Clear Metro cache
pnpm start -- --clear

# Or reset
rm -rf .expo node_modules
pnpm install
```

**iOS build issues**

```bash
cd ios
pod install
cd ..
pnpm ios
```

**Android build issues**

```bash
cd android
./gradlew clean
cd ..
pnpm android
```

**Type errors**

```bash
# Verify TypeScript configuration
pnpm check-types
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## 🤝 Contributing

Please read the [main contributing guide](../../CONTRIBUTING.md) before making changes.

---

<div align="center">
Built with ❤️ using Expo
</div>
