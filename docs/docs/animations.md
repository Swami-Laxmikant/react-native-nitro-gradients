---
sidebar_position: 6
---

# Reanimated Integration

We provide first class reanimated support, any gradient props can be a reanimated shared value also.

## Using Shared Values

```tsx
import { useEffect } from "react";
import { LinearGradient } from "react-native-nitro-gradient";
import {
  useSharedValue,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

function AnimatedGradient() {
  const start = useSharedValue({ x: "0%", y: "0%" });
  const end = useSharedValue({ x: "100%", y: "100%" });

  useEffect(() => {
    start.value = withTiming({ x: "0%", y: "1000%" });
    end.value = withTiming({ x: "100%", y: "0%" });
  }, []);

  return (
    <LinearGradient
      colors={["#ff0000", "#00ff00"]}
      start={start}
      end={end}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Circular Progress Bar

```tsx
import { useEffect } from "react";
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

function CircularProgressBar() {
  const progress = useSharedValue(0);
  const position = useDerivedValue(() => [0, progress.value, progress.value]);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      true
    );
  }, []);

  return (
    <SweepGradient
      colors={["#000000", "#000000", "#FFFFFF"]}
      positions={position}
      center={{ x: "50%", y: "50%" }}
      style={{ width: 200, height: 200, borderRadius: 100, overflow: "hidden" }}
    />
  );
}
```
