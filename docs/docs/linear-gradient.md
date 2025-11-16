---
sidebar_position: 3
---

# LinearGradient

The `LinearGradient` component creates smooth color transitions between two points in a straight line.

## Basic Usage

```tsx
import { LinearGradient } from 'react-native-nitro-gradient';

function MyComponent() {
  return (
    <LinearGradient
      colors={['#ff0000', '#00ff00', '#0000ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: '100%', y: '100%' }}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `colors` | `ColorValue[]` | ✅ | - | Array of colors for the gradient |
| `start` | `Vector` | ❌ | `{ x: '0%', y: '0%' }` | Start point of the gradient |
| `end` | `Vector` | ❌ | `{ x: '0%', y: '100%' }` | End point of the gradient |
| `positions` | `number[]` | ❌ | _Uniformly distributed from the start to the end_ | Optional array of color positions (0-1) |

## Simple Example

### Multi-Color Gradient with Positions

```tsx
<LinearGradient
  colors={['#ff0000', '#ffff00', '#00ff00', '#0000ff']}
  positions={[0, 0.33, 0.66, 1]}
  start={{ x: 0, y: 0 }}
  end={{ x: '100%', y: '100%' }}
  style={{ width: 300, height: 100 }}
/>
```

### Horizontal Gradient

```tsx
// left to right
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  start={{ x: 0, y: 0 }}
  end={{ x: '100%', y: 0 }}
  style={{ width: 300, height: 50 }}
/>
```

### Vertical Gradient

```tsx
// top to bottom
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: '100%' }}
  style={{ width: 100, height: 200 }}
/>
```

### Diagonal Gradients

```tsx
// Top-left to bottom-right
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  start={{ x: 0, y: 0 }}
  end={{ x: '100%', y: '100%' }}
  style={{ width: 200, height: 200 }}
/>
```

## Responsive Positioning

### Percentage-Based Coordinates

```tsx
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  start={{ x: '20%', y: '30%' }}
  end={{ x: '80%', y: '70%' }}
  style={{ width: 200, height: 200 }}
/>
```

### Explicit Dimension Control

```tsx
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  start={{ x: '25h%', y: '25w%' }}
  end={{ x: '75h%', y: '75w%' }}
  style={{ width: 200, height: 300 }}
/>
```

