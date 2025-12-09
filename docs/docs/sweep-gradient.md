---
sidebar_position: 5
---

# SweepGradient

The `SweepGradient` component creates gradients that sweep around a center point like a clock hand.

## Basic Usage

```tsx
import { SweepGradient } from 'react-native-nitro-gradients';

function MyComponent() {
  return (
    <SweepGradient
      colors={[0xFFFF0000, 0xFF00FF00, 0xFF0000FF]}
      center={{ x: '50%', y: '50%' }}
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
| `positions` | `number[]` | ❌ | _Uniformly distributed_ | Optional array of color positions (0-1) |


## Color Positioning

### Two Colors

```tsx
<SweepGradient
  colors={['#ff0000', '#00ff00']}
  style={{ width: 200, height: 200 }}
/>
```

### Multiple Colors with Positions

```tsx
<SweepGradient
  colors={['#ff0000', '#ffff00', '#00ff00', '#0000ff']}
  positions={[0, 0.33, 0.66, 1]}
  style={{ width: 200, height: 200 }}
/>
```

## Center Positioning

### Centered Sweep

```tsx
<SweepGradient
  colors={['#ff0000', '#00ff00', '#0000ff']}
  center={{ x: '50%', y: '50%' }}
  style={{ width: 200, height: 200 }}
/>
```

### Off-Center Sweep

```tsx
<SweepGradient
  colors={['#ff0000', '#00ff00']}
  center={{ x: '30%', y: '20%' }}  // Top-left area
  style={{ width: 300, height: 300 }}
/>
```
