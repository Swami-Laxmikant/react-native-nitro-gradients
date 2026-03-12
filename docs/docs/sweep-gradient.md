---
sidebar_position: 5
---

import { GradientPreview } from '@site/src/components/GradientPreview';

# SweepGradient

The `SweepGradient` component creates gradients that sweep around a center point like a clock hand.

## Basic Usage

{/* center=50%,50% → 140px,140px */}
<GradientPreview
  background="conic-gradient(from 0deg at 140px 140px, #f97316, #eab308, #22c55e, #06b6d4, #f97316)"
  height={280}
  borderRadius={24}
  style={{ maxWidth: 280 }}
/>

```tsx
import { SweepGradient } from 'react-native-nitro-gradients';

function MyComponent() {
  return (
    <SweepGradient
      colors={['#f97316', '#eab308', '#22c55e', '#06b6d4', '#f97316']}
      center={{ x: '50%', y: '50%' }}
      style={{ width: 280, height: 280, borderRadius: 24 }}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `colors` | `ColorValue[]` | ✅ | - | Array of colors for the gradient |
| `center` | `Vector` | ❌ | `{ x: '50%', y: '50%' }` | Center point of the gradient |
| `positions` | `number[]` | ❌ | Uniform around the sweep | Optional array of color positions in the range `0..1` |
| `blur` | `number` | ❌ | `0` | Gaussian blur radius in pixels applied to the rendered gradient |
| `tileMode` | `TileMode` | ❌ | `"clamp"` | Controls gradient edge behavior: `"clamp"` extends edge colors, `"decal"` uses transparent |

## Color positioning

### Two colors

{/* center default 50%,50% → 120px,120px */}
<GradientPreview
  background="conic-gradient(from 0deg at 120px 120px, #818cf8, #fb923c)"
  height={240}
  borderRadius={24}
  style={{ maxWidth: 240 }}
/>

```tsx
<SweepGradient
  colors={['#818cf8', '#fb923c']}
  style={{ width: 240, height: 240, borderRadius: 24 }}
/>
```

### Multiple colors with positions

{/* center=50%,50% → 130px,130px */}
<GradientPreview
  background="conic-gradient(from 0deg at 130px 130px, #ec4899 0%, #a855f7 25%, #3b82f6 50%, #06b6d4 75%, #ec4899 100%)"
  height={260}
  borderRadius={24}
  style={{ maxWidth: 260 }}
/>

```tsx
<SweepGradient
  colors={['#ec4899', '#a855f7', '#3b82f6', '#06b6d4', '#ec4899']}
  positions={[0, 0.25, 0.5, 0.75, 1]}
  style={{ width: 260, height: 260, borderRadius: 24 }}
/>
```

## Center positioning

### Centered sweep

{/* center=50%,50% → 130px,130px */}
<GradientPreview
  background="conic-gradient(from 0deg at 130px 130px, #fbbf24, #34d399, #60a5fa)"
  height={260}
  borderRadius={24}
  style={{ maxWidth: 260 }}
/>

```tsx
<SweepGradient
  colors={['#fbbf24', '#34d399', '#60a5fa']}
  center={{ x: '50%', y: '50%' }}
  style={{ width: 260, height: 260, borderRadius: 24 }}
/>
```

### Off-center sweep

{/* center=30%,25% of 300×300 → 90px,75px */}
<GradientPreview
  background="conic-gradient(from 0deg at 90px 75px, #f472b6, #c084fc)"
  height={300}
  borderRadius={24}
  style={{ maxWidth: 300 }}
/>

```tsx
<SweepGradient
  colors={['#f472b6', '#c084fc']}
  center={{ x: '30%', y: '25%' }}
  style={{ width: 300, height: 300, borderRadius: 24 }}
/>
```

## Blur

Blur lets sweep gradients feel less like a hard dial and more like an ambient ring.

{/* center default 50%,50% → 140px,140px */}
<GradientPreview
  background="conic-gradient(from 0deg at 140px 140px, #cb6b3f 0%, #f0d385 22%, #7fc1a4 50%, #74c2de 78%, #cb6b3f 100%)"
  height={280}
  borderRadius={999}
  blur={6}
  style={{ maxWidth: 280 }}
/>

```tsx
<SweepGradient
  colors={['#cb6b3f', '#f0d385', '#7fc1a4', '#74c2de', '#cb6b3f']}
  positions={[0, 0.22, 0.5, 0.78, 1]}
  blur={6}
  style={{ width: 280, height: 280, borderRadius: 999 }}
/>
```

## Demo

### Glass Orbit

{/* center=50%,50% → 140px,140px */}
<GradientPreview
  background="conic-gradient(from 210deg at 140px 140px, #cb6b3f, #f0d385, #7fc1a4, #74c2de, #cb6b3f)"
  height={280}
  borderRadius={999}
  blur={6}
  style={{ maxWidth: 280 }}
/>

```tsx
<SweepGradient
  colors={['#cb6b3f', '#f0d385', '#7fc1a4', '#74c2de', '#cb6b3f']}
  positions={[0, 0.22, 0.5, 0.78, 1]}
  center={{ x: '50%', y: '50%' }}
  blur={6}
  style={{ width: 280, height: 280, borderRadius: 999 }}
/>
```
