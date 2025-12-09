---
sidebar_position: 1
---

# Get Started

React Native Nitro Gradients provides three gradient components for React Native, with first‑class React Native Reanimated support.

> This project was bootstrapped from [react-native-nitro-image](https://github.com/mrousavy/react-native-nitro-image) by Marc Rousavy.

## Basic usage

```tsx
import { LinearGradient } from 'react-native-nitro-gradients';

function App() {
  return (
    <LinearGradient
      colors={['#ff0000', '#00ff00', '#0000ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 200, y: 200 }}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Concise API (summary)

- Components: `LinearGradient`, `RadialGradient`, `SweepGradient`
- Common props (each gradient prop can be a reanimated shared value):


| Gradient Type | colors | positions | start | end | center | radius |
|---------------|--------|-----------|-------|-----|--------|--------|
| LinearGradient | [`ColorValue[]`](./types#colorvalue) | `number[]` | [`Vector`](./types#vector) | [`Vector`](./types#vector) | — | — |
| RadialGradient | [`ColorValue[]`](./types#colorvalue) | `number[]` | — | — | [`Vector`](./types#vector) | [`RadiusValue`](./types#radiusvalue) |
| SweepGradient | [`ColorValue[]`](./types#colorvalue) | `number[]` | — | — | [`Vector`](./types#vector) | — |



Full details: see component pages and the API index.

## Reanimated (first‑class support)

All components accept reanimated's shared values out of the box.

```tsx
import { useEffect } from 'react';
import { LinearGradient } from 'react-native-nitro-gradients';
import { useSharedValue, withTiming } from 'react-native-reanimated';

function AnimatedExample() {
  const gradStart = useSharedValue({x: '0%', y: '0%'});
  const gradEnd = useSharedValue({x: '100%', y: '100%'});

  useEffect(() => {
    gradStart.value = withTiming({x: '100%', y: '0%'});
    gradEnd.value = withTiming({x: '0%', y: '100%'});
  }, []);

  return (
    <LinearGradient
      colors={["#000000", "#ffffff"]}
      start={gradStart}
      end={gradEnd}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

Next:
- Components: [Linear](./linear-gradient.md), [Radial](./radial-gradient.md), [Sweep](./sweep-gradient.md)
- [Reanimated guide](./animations.md)
- [Types](./types.md)
