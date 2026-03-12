---
sidebar_position: 4
---

import { GradientPreview } from '@site/src/components/GradientPreview';

# RadialGradient

The `RadialGradient` component creates circular gradients that radiate from a center point.

## Basic Usage

{/* center=50%,50% → CSS at 50% 50%. radius=60% of 280=168px → farthest extent ~168px */}
<GradientPreview
  background="radial-gradient(168px circle at 50% 50%, #fde68a, #f472b6, #312e81)"
  height={280}
  borderRadius={24}
  style={{ maxWidth: 280 }}
/>

```tsx
import { RadialGradient } from 'react-native-nitro-gradients';

function MyComponent() {
  return (
    <RadialGradient
      colors={['#fde68a', '#f472b6', '#312e81']}
      center={{ x: '50%', y: '50%' }}
      radius={'60%'}
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
| `radius` | `RadiusValue` | ❌ | `'50%'` | Radius of the gradient |
| `positions` | `number[]` | ❌ | Uniform from center to radius | Optional array of color positions in the range `0..1` |
| `blur` | `number` | ❌ | `0` | Gaussian blur radius in pixels applied to the rendered gradient |
| `tileMode` | `TileMode` | ❌ | `"clamp"` | Controls gradient edge behavior: `"clamp"` extends edge colors, `"decal"` uses transparent |

## Color positioning

{/* radius=55% of 300=165px, center default 50%,50% */}
<GradientPreview
  background="radial-gradient(165px circle at 50% 50%, #fef3c7 0%, #f97316 30%, #9a3412 65%, #1c1917 100%)"
  height={300}
  borderRadius={24}
  style={{ maxWidth: 300 }}
/>

```tsx
<RadialGradient
  colors={['#fef3c7', '#f97316', '#9a3412', '#1c1917']}
  positions={[0, 0.3, 0.65, 1]}
  radius={'55%'}
  style={{ width: 300, height: 300, borderRadius: 24 }}
/>
```

## Radius control

### Absolute radius

{/* radius=150px absolute, center at 150px,150px */}
<GradientPreview
  background="radial-gradient(150px circle at 50% 50%, #e0f2fe, #0284c7)"
  height={300}
  borderRadius={24}
  style={{ maxWidth: 300 }}
/>

```tsx
<RadialGradient
  colors={['#e0f2fe', '#0284c7']}
  center={{ x: '50%', y: '50%' }}
  radius={150}
  style={{ width: 300, height: 300, borderRadius: 24 }}
/>
```

### Responsive radius

{/* 60w% = 60% of width = 0.6×240 = 144px */}
<GradientPreview
  background="radial-gradient(144px circle at 50% 50%, #fae8ff, #a855f7)"
  height={240}
  borderRadius={24}
  style={{ maxWidth: 240 }}
/>

```tsx
<RadialGradient
  colors={['#fae8ff', '#a855f7']}
  radius={'60w%'}
  style={{ width: 240, height: 240, borderRadius: 24 }}
/>
```

## Center positioning

### Centered gradient

{/* radius=50% of 260=130px, center 50%,50% → 130px,130px */}
<GradientPreview
  background="radial-gradient(130px circle at 50% 50%, #ecfdf5, #059669, #022c22)"
  height={260}
  borderRadius={24}
  style={{ maxWidth: 260 }}
/>

```tsx
<RadialGradient
  colors={['#ecfdf5', '#059669', '#022c22']}
  center={{ x: '50%', y: '50%' }}
  radius={'50%'}
  style={{ width: 260, height: 260, borderRadius: 24 }}
/>
```

### Off-center gradient

{/* center=25%,30% → 75px,90px. radius=70% of 300=210px */}
<GradientPreview
  background="radial-gradient(210px circle at 25% 30%, #fef9c3, #f43f5e, #4c0519)"
  height={300}
  borderRadius={24}
  style={{ maxWidth: 300 }}
/>

```tsx
<RadialGradient
  colors={['#fef9c3', '#f43f5e', '#4c0519']}
  center={{ x: '25%', y: '30%' }}
  radius={'70%'}
  style={{ width: 300, height: 300, borderRadius: 24 }}
/>
```

## Blur

Blur is useful for halos, glows, and soft background panels.

{/* center=35%,30% → 119px,78px. radius=72% of 340=244.8px */}
<GradientPreview
  background="radial-gradient(245px circle at 35% 30%, #ffe7a3 0%, #ff7a86 32%, #2e1b47 100%)"
  height={260}
  borderRadius={28}
  blur={10}
  style={{ maxWidth: 340 }}
/>

```tsx
<RadialGradient
  colors={['#ffe7a3', '#ff7a86', '#2e1b47']}
  positions={[0, 0.32, 1]}
  center={{ x: '35%', y: '30%' }}
  radius={'72%'}
  blur={10}
  style={{ width: 340, height: 260, borderRadius: 28 }}
/>
```

## Demo

### Rose Halo

{/* center=35%,28% → 119px,72.8px. radius=72% of 340=244.8px */}
<GradientPreview
  background="radial-gradient(245px circle at 35% 28%, #f8ddb1 0%, #da748d 34%, #472345 100%)"
  height={260}
  borderRadius={28}
  blur={10}
  style={{ maxWidth: 340 }}
/>

```tsx
<RadialGradient
  colors={['#f8ddb1', '#da748d', '#472345']}
  positions={[0, 0.34, 1]}
  center={{ x: '35%', y: '28%' }}
  radius={'72%'}
  blur={10}
  style={{ width: 340, height: 260, borderRadius: 28 }}
/>
```
