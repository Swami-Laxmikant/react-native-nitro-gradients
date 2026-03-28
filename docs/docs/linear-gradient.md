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
| `angle` | `number` | ❌ | - | Angle in degrees. **When provided, `start` and `end` are ignored** |
| `positions` | `number[]` | ❌ | Uniform from start to end | Optional array of color positions in the range `0..1` |
| `blur` | `number` | ❌ | `0` | Gaussian blur radius in pixels applied to the rendered gradient |
| `tileMode` | `TileMode` | ❌ | `"clamp"` | Controls gradient edge behavior: `"clamp"` extends edge colors, `"decal"` uses transparent |

