import { Platform, StyleSheet } from "react-native";
import { palette } from "./theme";

const isIOS = Platform.OS === "ios";

export function formatSliderValue(value: number, max: number, step?: number) {
    if (max <= 1) {
        return `${Math.round(value * 100)}%`;
    }

    if (Number.isInteger(step ?? 1)) {
        return `${Math.round(value)}`;
    }

    return `${value.toFixed(1)}`;
}

export const sliderStyles = StyleSheet.create({
    sliderRow: isIOS
        ? {
              flex: 1,
              minWidth: 0,
              gap: 4,
              alignItems: "center",
          }
        : {
              width: "100%",
              gap: 6,
          },
    sliderHeader: isIOS
        ? {
              width: "100%",
              alignItems: "center",
              gap: 2,
              minHeight: 52,
          }
        : {
              width: "100%",
              gap: 2,
          },
    sliderLabel: {
        color: palette.inkSoft,
        fontSize: 10,
        fontWeight: "700",
        textAlign: isIOS ? "center" : "left",
        lineHeight: 12,
    },
    sliderValue: {
        color: palette.accent,
        fontSize: 10,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
        textAlign: isIOS ? "center" : "left",
    },
    sliderTrack: isIOS
        ? {
              width: "100%",
              height: 126,
              alignItems: "center",
              justifyContent: "center",
          }
        : {
              width: "100%",
              height: 28,
              justifyContent: "center",
          },
    slider: isIOS
        ? {
              width: 126,
              height: 28,
              transform: [{ rotate: "-90deg" }],
          }
        : {
              width: "100%",
              height: 28,
          },
});
