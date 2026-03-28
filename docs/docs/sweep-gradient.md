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

