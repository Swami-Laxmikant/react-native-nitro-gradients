---
sidebar_position: 6
---

import { CardGlowDemo } from '@site/src/components/CardGlowDemo';
import { GradientBorderDemo } from '@site/src/components/GradientBorderDemo';
import { AmbientPlayerDemo } from '@site/src/components/AmbientPlayerDemo';
import { CircularProgressDemo } from '@site/src/components/CircularProgressDemo';

# Reanimated Integration

Every gradient prop can be a Reanimated shared value. Colors, angles, coordinates, blur — all animate on the UI thread with zero bridge overhead.

## Card background glow

Place a `RadialGradient` behind a card and animate `blur` and `center` to create a pulsing ambient glow.

<CardGlowDemo />

```tsx
import { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { RadialGradient } from 'react-native-nitro-gradients';
import {
  useSharedValue, useDerivedValue,
  withTiming, withRepeat, cancelAnimation, Easing,
} from 'react-native-reanimated';

function CardGlow() {
  const [running, setRunning] = useState(true);
  const t = useSharedValue(0);

  const blur = useDerivedValue(() => 20 + ((Math.sin(t.value) + 1) / 2) * 16);
  const center = useDerivedValue(() => ({
    x: `${50 + Math.sin(t.value * 0.6) * 5}%`,
    y: `${50 + Math.cos(t.value * 0.8) * 4}%`,
  }));

  const start = () => {
    t.value = withRepeat(
      withTiming(Math.PI * 20, { duration: 60000, easing: Easing.linear }),
      -1,
    );
  };

  const toggle = () => {
    running ? cancelAnimation(t) : start();
    setRunning(!running);
  };

  useEffect(() => start(), []);

  return (
    <>
      <RadialGradient
        colors={['rgba(99,102,241,0.4)', 'rgba(168,85,247,0.2)', 'transparent']}
        center={center}
        radius="50%"
        blur={blur}
        style={styles.glow}
      />
      <SummaryCard />
      <Pressable onPress={toggle}>
        <Text>{running ? 'Stop' : 'Start'}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: 320,
    height: 260,
  },
});
```

## Animated gradient border

Use a `LinearGradient` as the outer layer, then place your card content on top with a slightly smaller frame to reveal the gradient as a border. Animate `angle` to spin the border.

<GradientBorderDemo />

```tsx
import { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'react-native-nitro-gradients';
import {
  useSharedValue, withTiming, withRepeat, cancelAnimation, Easing,
} from 'react-native-reanimated';

function GradientBorderCard() {
  const [running, setRunning] = useState(true);
  const angle = useSharedValue(0);

  const start = () => {
    angle.value = withRepeat(
      withTiming(360, { duration: 9000, easing: Easing.linear }),
      -1,
    );
  };

  const toggle = () => {
    running ? cancelAnimation(angle) : start();
    setRunning(!running);
  };

  useEffect(() => start(), []);

  return (
    <>
      <LinearGradient
        colors={['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#6366f1']}
        angle={angle}
        style={styles.border}
      >
        <PricingCard />
      </LinearGradient>
      <Pressable onPress={toggle}>
        <Text>{running ? 'Stop' : 'Start'}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  border: {
    width: 280,
    height: 180,
    borderRadius: 20,
    padding: 2.5,
  },
});
```

## Ambient player background

Use a `LinearGradient` as the full card background and animate `angle` and `colors` for a living, breathing surface.

<AmbientPlayerDemo />

```tsx
import { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'react-native-nitro-gradients';
import {
  useSharedValue, useDerivedValue,
  withTiming, withRepeat, cancelAnimation, Easing,
} from 'react-native-reanimated';

function AmbientPlayer() {
  const [running, setRunning] = useState(true);
  const t = useSharedValue(0);

  const angle = useDerivedValue(() => 135 + Math.sin(t.value * 0.3) * 30);
  const blur = useDerivedValue(() => 8 + Math.sin(t.value * 0.7) * 4);

  const start = () => {
    t.value = withRepeat(
      withTiming(Math.PI * 20, { duration: 60000, easing: Easing.linear }),
      -1,
    );
  };

  const toggle = () => {
    running ? cancelAnimation(t) : start();
    setRunning(!running);
  };

  useEffect(() => start(), []);

  return (
    <>
      <LinearGradient
        colors={['#1e1b4b', '#4c1d95', '#7c2d12']}
        angle={angle}
        blur={blur}
        style={styles.player}
      >
        <NowPlayingCard />
      </LinearGradient>
      <Pressable onPress={toggle}>
        <Text>{running ? 'Stop' : 'Start'}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  player: {
    width: 300,
    height: 200,
    borderRadius: 24,
  },
});
```

## Circular progress ring

Drive sweep gradient `positions` from a single progress value. Pass a background-colored circle as children to create the ring.

<CircularProgressDemo />

```tsx
import { useState, useEffect } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { SweepGradient } from 'react-native-nitro-gradients';
import {
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

function CircularProgress() {
  const [running, setRunning] = useState(true);
  const progress = useSharedValue(0);
  const positions = useDerivedValue(() => [
    0, progress.value, progress.value,
  ]);

  const startProgress = () => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.linear }),
      -1,
      true,
    );
  };

  const toggle = () => {
    running ? cancelAnimation(progress) : startProgress();
    setRunning(!running);
  };

  useEffect(() => startProgress(), []);

  return (
    <>
      <SweepGradient
        colors={['#6366f1', '#6366f1', '#e2e8f0']}
        positions={positions}
        center={{ x: '50%', y: '50%' }}
        style={styles.ring}
      >
        <View style={styles.innerCircle}>
          <ProgressLabel progress={progress} />
        </View>
      </SweepGradient>
      <Pressable onPress={toggle}>
        <Text>{running ? 'Stop' : 'Start'}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 164,
    height: 164,
    borderRadius: 82,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Tips

- **All props animate** — `colors`, `positions`, `start`, `end`, `angle`, `center`, `radius`, and `blur` all accept shared values.
- **UI thread** — Updates run entirely on the UI thread via Nitro Modules, no JS bridge serialization.
- **Derived values** — Use `useDerivedValue` to compute complex prop values from a single animated driver.
- **Combine freely** — Animate multiple props at once with independent durations and easings.
