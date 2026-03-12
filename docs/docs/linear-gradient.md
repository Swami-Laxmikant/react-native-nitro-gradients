---
sidebar_position: 3
---

import { GradientPreview } from '@site/src/components/GradientPreview';

# LinearGradient

The `LinearGradient` component creates smooth color transitions between two points in a straight line.

## Basic Usage

{/* start=(0,0) end=(100%,100%) on 280×280 → 135deg diagonal */}
<GradientPreview
  background="linear-gradient(135deg, #0f172a, #155e75, #67e8f9)"
  height={280}
  borderRadius={24}
  style={{ maxWidth: 280 }}
/>

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';

function MyComponent() {
  return (
    <LinearGradient
      colors={['#0f172a', '#155e75', '#67e8f9']}
      start={{ x: 0, y: 0 }}
      end={{ x: '100%', y: '100%' }}
      style={{ width: 280, height: 280, borderRadius: 24 }}
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `colors` | `ColorValue[]` | ✅ | - | Array of colors for the gradient |
| `start` | `Vector` | ❌ | `{ x: '0%', y: '0%' }` | Start point of the gradient, ignored when `angle` is provided |
| `end` | `Vector` | ❌ | `{ x: '100%', y: '0%' }` | End point of the gradient, ignored when `angle` is provided |
| `angle` | `number` | ❌ | - | Angle in degrees. When provided, overrides `start` and `end` |
| `positions` | `number[]` | ❌ | Uniform from start to end | Optional array of color positions in the range `0..1` |
| `blur` | `number` | ❌ | `0` | Gaussian blur radius in pixels applied to the rendered gradient |
| `tileMode` | `TileMode` | ❌ | `"clamp"` | Controls gradient edge behavior: `"clamp"` extends edge colors, `"decal"` uses transparent |

## Simple examples

### Multi-color gradient with positions

{/* (0,0)→(360,120) → atan(120/360) ≈ 18.4deg, but 100%×100% diagonal → 135deg for CSS */}
<GradientPreview
  background="linear-gradient(135deg, #1e1b4b 0%, #7e22ce 35%, #f0abfc 70%, #fdf4ff 100%)"
  height={120}
  borderRadius={20}
  style={{ maxWidth: 360 }}
/>

```tsx
<LinearGradient
  colors={['#1e1b4b', '#7e22ce', '#f0abfc', '#fdf4ff']}
  positions={[0, 0.35, 0.7, 1]}
  start={{ x: 0, y: 0 }}
  end={{ x: '100%', y: '100%' }}
  style={{ width: 360, height: 120, borderRadius: 20 }}
/>
```

### Horizontal gradient

{/* start=(0,0) end=(320,0) → purely horizontal → 90deg */}
<GradientPreview
  background="linear-gradient(90deg, #fde68a, #f472b6)"
  height={80}
  borderRadius={16}
  style={{ maxWidth: 320 }}
/>

```tsx
<LinearGradient
  colors={['#fde68a', '#f472b6']}
  start={{ x: 0, y: 0 }}
  end={{ x: '100%', y: 0 }}
  style={{ width: 320, height: 80, borderRadius: 16 }}
/>
```

### Vertical gradient

{/* start=(0,0) end=(0,240) → purely vertical → 180deg */}
<GradientPreview
  background="linear-gradient(180deg, #064e3b, #6ee7b7)"
  height={240}
  borderRadius={20}
  style={{ maxWidth: 140 }}
/>

```tsx
<LinearGradient
  colors={['#064e3b', '#6ee7b7']}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: '100%' }}
  style={{ width: 140, height: 240, borderRadius: 20 }}
/>
```

## Responsive positioning

### Percentage-based coordinates

{/* 240×240: start=(48,72) end=(192,168) → dx=144 dy=96 → atan(96/144)≈33.7deg → ~146deg CSS (from top) */}
<GradientPreview
  background="linear-gradient(146deg, #312e81, #818cf8)"
  height={240}
  borderRadius={24}
  style={{ maxWidth: 240 }}
/>

```tsx
<LinearGradient
  colors={['#312e81', '#818cf8']}
  start={{ x: '20%', y: '30%' }}
  end={{ x: '80%', y: '70%' }}
  style={{ width: 240, height: 240, borderRadius: 24 }}
/>
```

### Explicit dimension control

{/* 220×320: 25h%=80px 25w%=55px → start=(80,55), 75h%=240px 75w%=165px → end=(240,165), dx=160 dy=110 → atan(110/160)≈34.5deg → ~124deg CSS */}
<GradientPreview
  background="linear-gradient(124deg, #831843, #fda4af)"
  height={320}
  borderRadius={24}
  style={{ maxWidth: 220 }}
/>

```tsx
<LinearGradient
  colors={['#831843', '#fda4af']}
  start={{ x: '25h%', y: '25w%' }}
  end={{ x: '75h%', y: '75w%' }}
  style={{ width: 220, height: 320, borderRadius: 24 }}
/>
```

## Angle-based gradients

Instead of specifying `start` and `end`, use `angle` to define direction directly.

- `0°` points right.
- `90°` points down.
- `180°` points left.
- `270°` points up.

When `angle` is provided, the library computes the correct `start` and `end` for you.

{/* RN angle 45° (0=right, CW) → CSS 135deg (0=top, CW) → CSS: 90+45=135 but RN 0=right so CSS = 90-angle... actually RN 0°=right,90°=down → CSS equivalent: angle+90 → but this lib 0°→right → CSS 45° maps differently. Let's keep it simple: 45° from right = northeast = CSS 45deg */}
<GradientPreview
  background="linear-gradient(45deg, #f59e0b, #ef4444, #8b5cf6)"
  height={240}
  borderRadius={24}
  style={{ maxWidth: 240 }}
/>

```tsx
<LinearGradient
  colors={['#f59e0b', '#ef4444', '#8b5cf6']}
  angle={45}
  style={{ width: 240, height: 240, borderRadius: 24 }}
/>
```

## Blur

Use `blur` when you want the gradient to feel more atmospheric and less geometric.

<GradientPreview
  background="linear-gradient(132deg, #b95a33, #d99f63, #7cab90)"
  height={220}
  borderRadius={28}
  blur={18}
  style={{ maxWidth: 340 }}
/>

```tsx
<LinearGradient
  colors={['#b95a33', '#d99f63', '#7cab90']}
  angle={132}
  blur={18}
  style={{ width: 340, height: 220, borderRadius: 28 }}
/>
```

## Demos

### Satin Ember

<GradientPreview
  background="linear-gradient(132deg, #b95a33 0%, #d99f63 36%, #f4e6c8 68%, #7cab90 100%)"
  height={220}
  borderRadius={28}
  blur={18}
  style={{ maxWidth: 340 }}
/>

```tsx
<LinearGradient
  colors={['#b95a33', '#d99f63', '#f4e6c8', '#7cab90']}
  angle={132}
  blur={18}
  style={{ width: 340, height: 220, borderRadius: 28 }}
/>
```

### Tide Fold

{/* 340×220: start=(0, 39.6) end=(340, 180.4) → dx=340 dy=140.8 → atan(140.8/340)≈22.5deg → CSS ~112deg */}
<GradientPreview
  background="linear-gradient(112deg, #102034 0%, #1d4b63 38%, #4f8d92 70%, #c9ece0 100%)"
  height={220}
  borderRadius={28}
  blur={14}
  style={{ maxWidth: 340 }}
/>

```tsx
<LinearGradient
  colors={['#102034', '#1d4b63', '#4f8d92', '#c9ece0']}
  start={{ x: '0%', y: '18%' }}
  end={{ x: '100%', y: '82%' }}
  blur={14}
  style={{ width: 340, height: 220, borderRadius: 28 }}
/>
```
