---
sidebar_position: 4
---

# RadialGradient

The `RadialGradient` component creates circular gradients that radiate from a center point.

## Basic Usage

```tsx
import { RadialGradient } from 'react-native-nitro-gradients';

function MyComponent() {
  return (
    <RadialGradient
      colors={['#ff0000', '#00ff00', '#0000ff']}
      center={{ x: '50%', y: '50%' }}
      radius={100}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `colors` | `ColorValue[]` | ✅ | - | Array of colors for the gradient |
| `center` | `Vector` | ❌ | `{ x: '50%', y: '50%' }` | Center point of the gradient |
| `radius` | `RadiusValue` | ❌ | `'50w%'` | Radius of the gradient |
| `positions` | `number[]` | ❌ | _Uniformly distributed from the center to the radius_ | Optional array of color positions (0-1) |

## Color Positioning


### Simple Radial Gradient

```tsx
<RadialGradient
  colors={['#ff0000', '#ffff00', '#00ff00', '#0000ff']}
  positions={[0, 0.33, 0.66, 1]}
  radius={150}
  style={{ width: 300, height: 300 }}
/>
```


## Radius Control

### Absolute Radius

```tsx
<RadialGradient
  colors={['#ff0000', '#00ff00']}
  center={{ x: '50%', y: '50%' }}
  radius={150}
  style={{ width: 300, height: 300 }}
/>
```

### Responsive Radius

```tsx
<RadialGradient
  colors={['#ff0000', '#00ff00']}
  radius={'60w%'}  // 60% of width
  style={{ width: 200, height: 200 }}
/>
```

## Center Positioning

### Centered Gradient

```tsx
<RadialGradient
  colors={['#ff0000', '#00ff00']}
  center={{ x: '50%', y: '50%' }} // center of the view
  radius={100}
  style={{ width: 200, height: 200 }}
/>
```

### Off-Center Gradient

```tsx
<RadialGradient
  colors={['#ff0000', '#00ff00']}
  center={{ x: '20%', y: '30%' }}  // Top-left area
  radius={120}
  style={{ width: 300, height: 300 }}
/>
```
