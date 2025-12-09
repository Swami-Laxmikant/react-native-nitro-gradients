import React, { useState } from "react";
import { Button, ColorValue, ScrollView, StyleSheet, View } from "react-native";
import { SweepGradient, Vector } from "react-native-nitro-gradients";
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

const startColors = ["#FF0000", "#00FF00", "#0000FF"];
const interpolationRange = [0, 1];
const endColors = ["#0000FF", "#FF0000", "#00FF00"];

export function SweepGradientScreen() {
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
    colorProgress.value = withTiming(colorProgress.value === 0 ? 1 : 0, {
      duration: 5000,
    });
  };

  const positions = useSharedValue<number[] | undefined>([0, 0.5, 1]);
  const updatePositions = () => {
    const cf = positions.value![1];
    const finalValue = cf === 0.5 ? [0, 0.33, 0.66] : [0, 0.5, 1];
    positions.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  const center = useSharedValue<Vector | undefined>({ x: "50%", y: "50%" });
  const updateCenter = () => {
    const cf = center.value!.x;
    const finalValue =
      cf === "50%" ? { x: "25%", y: "25%" } : { x: "50%", y: "50%" };
    center.value = withTiming(finalValue, {
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

  const [center7, setCenter] = useState<Vector>({ x: "50%", y: "50%" });

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

  const updateCenter7 = () => {
    setCenter((pre) =>
      pre.x === "50%" ? { x: "70%", y: "30%" } : { x: "50%", y: "50%" }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SweepGradient
        colors={["#FF0000", "#00FF00", "#0000FF", "#FF0000"]}
        style={styles.gradient1}
        center={toVec(0.5, 0.5)}
      />
      <SweepGradient
        colors={["#667EEA", "#764BA2", "#F093FB", "#667EEA"]}
        style={styles.gradient1}
        center={toVec(0.3, 0.7)}
        key={2}
      />
      <SweepGradient
        colors={["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#A8E6CF"]}
        center={toVec(0.5, 0.5)}
        style={styles.gradient1}
      />

      <View style={styles.container}>
        <SweepGradient
          center={center}
          positions={positions}
          colors={colors}
          style={styles.gradient1}
        />
        <View style={styles.row}>
          <Button title="swap colors" onPress={animateGrad} />
          <Button title="update positions" onPress={updatePositions} />
          <Button title="update center" onPress={updateCenter} />
        </View>
      </View>

      <View style={styles.container}>
        <SweepGradient
          colors={colors7}
          center={center7}
          positions={positions7}
          style={styles.gradient4}
        />
        <View style={styles.row}>
          <Button title="reverse colors" onPress={updateColors7} />
          <Button title="change positions" onPress={updatePositions7} />
          <Button title="change center" onPress={updateCenter7} />
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
  gradient4: {
    width: "100%",
    aspectRatio: 2,
    overflow: "hidden",
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
