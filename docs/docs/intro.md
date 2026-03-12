---
sidebar_position: 1
---

import { GradientPreview } from '@site/src/components/GradientPreview';
import { AnimatedGradientDemo } from '@site/src/components/AnimatedGradientDemo';

# Get Started

React Native Nitro Gradients provides three gradient components for React Native with first-class Reanimated support and native rendering through Nitro Modules.

## Linear

<GradientPreview
  background="linear-gradient(135deg, #0f172a, #155e75, #67e8f9)"
  height={180}
  borderRadius={24}
  style={{ maxWidth: 260 }}
/>

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';

<LinearGradient
  colors={['#0f172a', '#155e75', '#67e8f9']}
  angle={135}
  style={{ width: 260, height: 180, borderRadius: 24 }}
/>
```

## Radial

<GradientPreview
  background="radial-gradient(195px circle at 130px 117px, #fde68a, #f472b6, #312e81)"
  height={260}
  borderRadius={24}
  style={{ maxWidth: 260 }}
/>

```tsx
import { RadialGradient } from 'react-native-nitro-gradients';

<RadialGradient
  colors={['#fde68a', '#f472b6', '#312e81']}
  center={{ x: '50%', y: '45%' }}
  radius="75%"
  style={{ width: 260, height: 260, borderRadius: 24 }}
/>
```

## Sweep

<GradientPreview
  background="conic-gradient(from 0deg at 130px 130px, #f97316 0%, #eab308 25%, #22c55e 50%, #06b6d4 75%, #f97316 100%)"
  height={260}
  borderRadius={24}
  blur={4}
  style={{ maxWidth: 260 }}
/>

```tsx
import { SweepGradient } from 'react-native-nitro-gradients';

<SweepGradient
  colors={['#f97316', '#eab308', '#22c55e', '#06b6d4', '#f97316']}
  positions={[0, 0.25, 0.5, 0.75, 1]}
  blur={4}
  style={{ width: 260, height: 260, borderRadius: 24 }}
/>
```

## Concise API

| Prop | LinearGradient | RadialGradient | SweepGradient |
|------|----------------|----------------|---------------|
| colors | [`ColorValue[]`](./types#colorvalue) | [`ColorValue[]`](./types#colorvalue) | [`ColorValue[]`](./types#colorvalue) |
| positions | `number[]` | `number[]` | `number[]` |
| start | [`Vector`](./types#vector) | - | - |
| end | [`Vector`](./types#vector) | - | - |
| angle | `number` | - | - |
| center | - | [`Vector`](./types#vector) | [`Vector`](./types#vector) |
| radius | - | [`RadiusValue`](./types#radiusvalue) | - |
| blur | `number` | `number` | `number` |

## Blur

All three gradient types support a `blur` prop that applies a Gaussian blur to the rendered gradient.

<GradientPreview
  background="linear-gradient(160deg, #7c3aed, #c084fc, #e9d5ff)"
  height={180}
  borderRadius={24}
  blur={12}
  style={{ maxWidth: 280 }}
/>

```tsx
<LinearGradient
  colors={['#7c3aed', '#c084fc', '#e9d5ff']}
  angle={160}
  blur={12}
  style={{ width: 280, height: 180, borderRadius: 24 }}
/>
```

## Reanimated support

All components accept Reanimated shared values out of the box — colors, angles, blur, and coordinates all animate on the UI thread.

<AnimatedGradientDemo />

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';
import { useSharedValue, withTiming } from 'react-native-reanimated';

function AnimatedCard() {
  const angle = useSharedValue(135);
  const blur = useSharedValue(0);

  const onPress = () => {
    angle.value = withTiming(270, { duration: 800 });
    blur.value = withTiming(16, { duration: 600 });
  };

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#0f172a', '#155e75', '#67e8f9']}
        angle={angle}
        blur={blur}
        style={{ width: 280, height: 200, borderRadius: 24 }}
      />
    </Pressable>
  );
}
```

## Next steps

- Read the component docs for [Linear](./linear-gradient.md), [Radial](./radial-gradient.md), and [Sweep](./sweep-gradient.md) — each includes inline visual previews.
- Review the [Reanimated guide](./animations.md) and [Type definitions](./types.md).
