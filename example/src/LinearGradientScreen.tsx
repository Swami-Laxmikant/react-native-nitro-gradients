import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  ColorValue,
  Button,
  View,
  PixelRatio,
} from "react-native";
import { LinearGradient, Vector } from "react-native-nitro-gradients";
import {
  Easing,
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const startColors = ["#000", "#fff"];
const endColors = ["#fff", "#000"];

export function LinearGradientScreen() {
  const interpolationRange = [0, 1];

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

  const positions = useSharedValue<number[]>([0.5, 0.5]);
  const updatePositions = () => {
    const cf = positions.value[0];
    const finalValue = cf === 0 ? [0.5, 0.5] : [0, 1];
    positions.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  const start = useSharedValue<Vector>({ x: "0%", y: "0%" });
  const start2 = useSharedValue<Vector>({ x: "0%", y: "0%" });
  const end = useSharedValue<Vector>({ x: "100%", y: "0%" });

  const updateStart = () => {
    const cf = start.value.x;
    const finalValue =
      cf !== "0%" ? { x: "0%", y: "0%" } : { x: "50%", y: "0%" };
    console.log("the final value", cf, finalValue);
    start.value = withTiming(finalValue, {
      duration: 350,
    });
  };

  // useDerivedValue(()=>{
  //   console.log("start is changing", start.value)
  // })

  const updateEnd = () => {
    const cf = end.value!.y;
    const finalValue =
      cf === "0%" ? { x: "0%", y: "100%" } : { x: "100%", y: "0%" };
    end.value = withTiming(finalValue, {
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
  const [start7, setStart] = useState<Vector>({ x: "0%", y: "0%" });
  const [end7, setEnd] = useState<Vector>({ x: "100%", y: "0%" });

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
    setStart((pre) => ({ ...pre, x: pre.x === "0%" ? "50%" : "0%" }));
  };

  const updateEnd7 = () => {
    setEnd((pre) => ({ ...pre, y: pre.y === "0%" ? "100%" : "0%" }));
  };

  const angle = useSharedValue(0);
  const rotate = () => {
    angle.value = 0;
    const f = 10;
    angle.value = withTiming(360 * f, {easing: Easing.linear, duration: 1000 * f})
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
    >
      <View style={styles.container}>
        <LinearGradient
          style={styles.gradient1}
          positions={[0.5, 0.5]}
          angle={angle}
          colors={["black", "white"]}
        />
        <View style={styles.row}>
          <Button title="Rotate" onPress={rotate} />
        </View>
      </View>
      <LinearGradient
        colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}
        start={{ x: "0%", y: "50%" }}
        end={{ x: "100%", y: "50%" }}
        style={styles.gradient1}
        key={2}
      />

      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.gradient1}
      />

      <LinearGradient
        colors={["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5"]}
        start={{ x: "50%", y: "0%" }}
        end={{ x: "50%", y: "100%" }}
        style={styles.gradient1}
      />

      <View style={styles.container}>
        <LinearGradient
          start={start}
          end={end}
          positions={positions}
          colors={colors}
          style={styles.gradient1}
        />
        <View style={styles.row}>
          <Button title="swap colors" onPress={animateGrad} />
          <Button title="update positions" onPress={updatePositions} />
          <Button title="update start" onPress={updateStart} />
          <Button title="update end" onPress={updateEnd} />
        </View>
      </View>

      <View style={styles.container}>
        <LinearGradient
          colors={colors7}
          start={start7}
          end={end7}
          positions={positions7}
          style={styles.graident4}
        />
        <View style={styles.row}>
          <Button title="reverse colors" onPress={updateColors7} />
          <Button title="change positions" onPress={updatePositions7} />
          <Button title="change start" onPress={updateStart7} />
          <Button title="change end" onPress={updateEnd7} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
  },
  scrollView: {
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
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
    overflow: "hidden",
    borderColor: "black",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  container: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 18,
    padding: 10,
  },
});
