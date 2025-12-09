---
sidebar_position: 3
---

# LinearGradient

The `LinearGradient` component creates smooth color transitions between two points in a straight line.

## Basic Usage

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';

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
| `start` | `Vector` | ❌ | `{ x: '0%', y: '0%' }` | Start point of the gradient (ignored when `angle` is provided) |
| `end` | `Vector` | ❌ | `{ x: '0%', y: '100%' }` | End point of the gradient (ignored when `angle` is provided) |
| `angle` | `number` | ❌ | - | Angle in degrees. When provided, overrides `start` and `end` props |
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

## Angle-Based Gradients

Instead of specifying `start` and `end` points, you can use the `angle` prop to define the gradient direction. The angle is measured in degrees (0-360), where:
- `0°` = right (horizontal, left to right)
- `90°` = bottom (vertical, top to bottom)
- `180°` = left (horizontal, right to left)
- `270°` = top (vertical, bottom to top)

When `angle` is provided, it automatically calculates the `start` and `end` points, so the `start` and `end` props are ignored.

### Common Angles

```tsx
// 0° - Horizontal (left to right)
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  angle={0}
  style={{ width: 300, height: 50 }}
/>

// 90° - Vertical (top to bottom)
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  angle={90}
  style={{ width: 100, height: 200 }}
/>

// 45° - Diagonal (top-left to bottom-right)
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  angle={45}
  style={{ width: 200, height: 200 }}
/>

// 135° - Diagonal (top-right to bottom-left)
<LinearGradient
  colors={['#ff0000', '#00ff00']}
  angle={135}
  style={{ width: 200, height: 200 }}
/>
```

### Animated Angle

The `angle` prop supports Reanimated shared values, making it easy to create rotating gradient animations:

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect } from 'react';

function RotatingGradient() {
  const angle = useSharedValue(0);

  useEffect(() => {
    angle.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1, // infinite repeat
      false
    );
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      angle={angle}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

