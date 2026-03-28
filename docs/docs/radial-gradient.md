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

