# @bestaff/ui

<div align="center">

A shared UI component library for BestAff React Native applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [Theming](#theming)
- [Best Practices](#best-practices)
- [Development](#development)

## 🚀 Installation

This package is part of the BestAff monorepo and is automatically available to workspace packages.

```typescript
import { Button } from '@bestaff/ui/button';
import { Card } from '@bestaff/ui/card';
import { Code } from '@bestaff/ui/code';
```

## 💡 Usage

### Basic Example

```typescript
import { Button } from '@bestaff/ui/button';
import { Card } from '@bestaff/ui/card';

function MyScreen() {
  return (
    <Card>
      <Button onPress={() => console.log('Pressed')}>Click Me</Button>
    </Card>
  );
}
```

### With Theme

All components respect the theme from `@bestaff/theme`:

```typescript
import { Button } from '@bestaff/ui/button';
import { useTheme } from '@bestaff/theme';

function ThemedButton() {
  const theme = useTheme();

  return (
    <Button
      style={{ backgroundColor: theme.colors.primary }}
      onPress={() => console.log('Pressed')}
    >
      Themed Button
    </Button>
  );
}
```

## 🧩 Components

### Button

A customizable button component with multiple variants.

```typescript
import { Button } from '@bestaff/ui/button';

// Basic usage
<Button onPress={() => {}}>
  Press Me
</Button>

// With variants (extend as needed)
<Button variant="primary" onPress={() => {}}>
  Primary Button
</Button>

<Button variant="secondary" onPress={() => {}}>
  Secondary Button
</Button>
```

**Props**

| Prop       | Type                       | Default   | Description          |
| ---------- | -------------------------- | --------- | -------------------- |
| `children` | `ReactNode`                | -         | Button content       |
| `onPress`  | `() => void`               | -         | Press event handler  |
| `variant`  | `'primary' \| 'secondary'` | `primary` | Button style variant |
| `disabled` | `boolean`                  | `false`   | Disabled state       |
| `style`    | `ViewStyle`                | -         | Custom styles        |

### Card

A container component for grouping related content.

```typescript
import { Card } from '@bestaff/ui/card';

<Card>
  <Text>Card Content</Text>
</Card>

// With custom styles
<Card style={{ padding: 20 }}>
  <Text>Custom Styled Card</Text>
</Card>
```

**Props**

| Prop       | Type         | Default | Description            |
| ---------- | ------------ | ------- | ---------------------- |
| `children` | `ReactNode`  | -       | Card content           |
| `style`    | `ViewStyle`  | -       | Custom styles          |
| `onPress`  | `() => void` | -       | Optional press handler |

### Code

A component for displaying code snippets with syntax highlighting.

```typescript
import { Code } from '@bestaff/ui/code';

<Code language="typescript">
  {`const greeting = "Hello World";`}
</Code>
```

**Props**

| Prop       | Type                                     | Default | Description             |
| ---------- | ---------------------------------------- | ------- | ----------------------- |
| `children` | `string`                                 | -       | Code content            |
| `language` | `'typescript' \| 'javascript' \| 'json'` | -       | Syntax language         |
| `style`    | `ViewStyle`                              | -       | Custom container styles |

## 🎨 Theming

All components are designed to work seamlessly with `@bestaff/theme`.

### Using Theme Context

```typescript
import { useTheme } from '@bestaff/theme';
import { Button, Card } from '@bestaff/ui';

function ThemedComponent() {
  const theme = useTheme();

  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Button
        style={{
          backgroundColor: theme.colors.primary,
          padding: theme.spacing.md,
        }}
      >
        Themed Button
      </Button>
    </Card>
  );
}
```

### Custom Theme Variants

Create custom variants by extending components:

```typescript
import { Button } from '@bestaff/ui/button';
import { useTheme } from '@bestaff/theme';

export function DangerButton(props) {
  const theme = useTheme();

  return (
    <Button
      {...props}
      style={[
        { backgroundColor: theme.colors.error },
        props.style,
      ]}
    />
  );
}
```

## 🎯 Best Practices

### 1. Component Composition

```typescript
// ✅ Good - Composable components
<Card>
  <Button onPress={handlePress}>
    <Text>Submit</Text>
  </Button>
</Card>

// ❌ Avoid - Tightly coupled
<SubmitCard onPress={handlePress} />
```

### 2. Use Theme Tokens

```typescript
// ✅ Good - Uses theme
const styles = {
  button: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
};

// ❌ Avoid - Hard-coded values
const styles = {
  button: {
    padding: 16,
    backgroundColor: '#3B82F6',
  },
};
```

### 3. Props Spreading

```typescript
// ✅ Good - Forward props
export function CustomButton({ children, ...props }) {
  return <Button {...props}>{children}</Button>;
}

// ❌ Avoid - Lost props
export function CustomButton({ children }) {
  return <Button>{children}</Button>;
}
```

### 4. Type Safety

```typescript
// ✅ Good - Type-safe props
interface CustomButtonProps extends ComponentProps<typeof Button> {
  variant: 'primary' | 'secondary';
}

export function CustomButton({ variant, ...props }: CustomButtonProps) {
  return <Button {...props} />;
}
```

## 🛠 Development

### Adding New Components

1. **Create component file**

```typescript
// src/my-component.tsx
import { View, Text, type ViewProps } from 'react-native';

export interface MyComponentProps extends ViewProps {
  title: string;
}

export function MyComponent({ title, ...props }: MyComponentProps) {
  return (
    <View {...props}>
      <Text>{title}</Text>
    </View>
  );
}
```

2. **Export from package**

The component is automatically available at `@bestaff/ui/my-component`.

3. **Add tests** (optional)

```typescript
// src/__tests__/my-component.test.tsx
import { render } from '@testing-library/react-native';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
  it('renders title', () => {
    const { getByText } = render(<MyComponent title="Hello" />);
    expect(getByText('Hello')).toBeTruthy();
  });
});
```

### Component Guidelines

- ✅ Use TypeScript with proper prop types
- ✅ Forward ref when necessary
- ✅ Support custom styling via `style` prop
- ✅ Use theme tokens from `@bestaff/theme`
- ✅ Provide default props where applicable
- ✅ Document props with JSDoc comments
- ✅ Keep components focused and single-responsibility

### Testing Components

```bash
# Run tests
pnpm test

# Type checking
pnpm check-types

# Linting
pnpm lint
```

## 📝 Component Checklist

When creating a new component:

- [ ] TypeScript interfaces defined
- [ ] Theme integration
- [ ] Proper prop spreading
- [ ] Accessibility props (a11y)
- [ ] Documentation/comments
- [ ] Examples in README
- [ ] Tests (optional but recommended)

## 🔄 Component Lifecycle

### Development Workflow

1. Create component in `src/`
2. Test in Storybook (if available)
3. Test in actual app
4. Document in README
5. Build and publish (automated)

## 📚 Examples

### Form Components

```typescript
import { Button, Card } from '@bestaff/ui';
import { TextInput } from 'react-native';

function LoginForm() {
  return (
    <Card>
      <TextInput placeholder="Email" />
      <TextInput placeholder="Password" secureTextEntry />
      <Button onPress={handleLogin}>Log In</Button>
    </Card>
  );
}
```

### List Components

```typescript
import { Card } from '@bestaff/ui/card';
import { FlatList } from 'react-native';

function ItemList({ items }) {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <Card>
          <Text>{item.title}</Text>
        </Card>
      )}
    />
  );
}
```

## 🤝 Contributing

To add or modify components:

1. Follow the component guidelines above
2. Ensure TypeScript types are correct
3. Update this README
4. Test thoroughly
5. Submit PR

## 📖 API Reference

For detailed API documentation of each component, see:

- [Button Component](./src/button.tsx)
- [Card Component](./src/card.tsx)
- [Code Component](./src/code.tsx)

---

<div align="center">
Part of the @bestaff monorepo
</div>
