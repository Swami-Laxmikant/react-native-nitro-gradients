import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ColorValue, Button } from "react-native";
import { RadialGradient, Vector, RadiusValue } from "react-native-nitro-gradient";
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const toVec = (x: number, y: number, isFraction?: boolean) => {
  const isXFraction = isFraction ?? (x <= 1 && x >= -1);
  const isYFraction = isFraction ?? (y <= 1 && y >= -1);

  return {
    x: isXFraction ? `${x * 100}%` : x,
    y: isYFraction ? `${y * 100}%` : y,
  };
};

const startColors = ["#000", "#fff"];
const interpolationRange = [0, 1];
const endColors = ["#fff", "#000"];

export function RadialGradientScreen() {


  const colorProgress = useSharedValue(0);

  const colors = useDerivedValue(() =>
    startColors.map(
      (c, i) =>
        interpolateColor(colorProgress.value, interpolationRange, [
          c,
          endColors[i],
        ]) as ColorValue
    )
  );

  const animateGrad = () => {
    colorProgress.value = withTiming(colorProgress.value === 0 ? 1 : 0);
  };

  const positions = useSharedValue<number[] | undefined>([0.5, 0.5]);
  const updatePositions = () => {
    const cf = positions.value![0];
    const finalValue = cf === 0 ? [0.5, 0.5] : [0, 1];
    positions.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  const start = useSharedValue<Vector | undefined>({ x: '0%', y: '0%' });
  const radius = useSharedValue<RadiusValue | undefined>(100);

  const updateCentre = () => {
    const cf = start.value!.x;
    const finalValue = cf === '0%' ? { x: '50%', y: '0%' } : { x: '0%', y: '0%' };
    start.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  const updateRadius = () => {
    const cf = radius.value;
    const finalValue = cf === 100 ? 200 : 100;
    radius.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  const [colors7, setColors] = useState([
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3",
  ]);

  const [positions7, setPositions] = useState([
    0, 0.16, 0.33, 0.5, 0.66, 0.83, 1,
  ]);

  const [start7, setStart] = useState<Vector>({ x: 0, y: 0 });
  const [radius7, setRadius] = useState<RadiusValue>('50%');

  const updateColors7 = () => {
    setColors((pre) => [...pre].reverse());
  };

  const updatePositions7 = () => {
    setPositions((pre) => {
      if (pre[1] === 0.16) {
        return [0, 0.33, 0.33, 0.5, 0.5, 0.83, 0.83];
      } else {
        return [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1];
      }
    });
  };

  const updateStart7 = () => {
    setStart((pre) => ({ ...pre, x: pre.x === 0 ? '50%' : 0 }));
  };

  const updateRadius7 = () => {
    setRadius((pre) => pre === '50%' ? '100w%' : '50%');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <RadialGradient
        colors={['#1A2980', '#26D0CE', '#E0F7FA']}
        style={styles.gradient1}
        radius={180}
      />
      <RadialGradient
        colors={['#667EEA', '#764BA2', '#F093FB']}
        style={styles.gradient1}
        center={toVec(0, 0.5)}
        radius={'50%'}
      />
      <RadialGradient
        colors={["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5"]}
        center={toVec(0.5, 0)}
        radius={100}
        style={styles.gradient1}
      />
      <View style={styles.container}>
        <RadialGradient
          center={start}
          radius={radius}
          positions={positions}
          colors={colors}
          style={styles.gradient1}
        />
        <View style={styles.row}>
          <Button title="swap colors" onPress={animateGrad} />
          <Button title="update positions" onPress={updatePositions} />
          <Button title="update centre" onPress={updateCentre} />
          <Button title="update radius" onPress={updateRadius} />
        </View>
      </View>

      <View style={styles.container}>
        <RadialGradient
          colors={colors7}
          center={start7}
          radius={radius7}
          positions={positions7}
          style={styles.graident4}
        />
        <View style={styles.row}>
          <Button title="reverse colors" onPress={updateColors7} />
          <Button title="change positions" onPress={updatePositions7} />
          <Button title="change centre" onPress={updateStart7} />
          <Button title="change radius" onPress={updateRadius7} />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  gradient1: {
    padding: 30,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    overflow: "hidden",
  },
  graident4: {
    width: "100%",
    aspectRatio: 2,
    overflow: 'hidden',
    borderColor: "black",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
