import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SweepGradient, type Vector } from "react-native-nitro-gradients";
import { useSharedValue } from "react-native-reanimated";
import { Chip, ControlRow, DemoCard, palette } from "../demo-ui";
import { previewStyles } from "./shared";

type DemoState = "default" | "custom" | "reset";

const colors = ["#1a0926", "#5f1dd3", "#f66e54", "#fff0dd"];

function labelFor(state: DemoState) {
    if (state === "custom") {
        return "Custom props active";
    }
    if (state === "reset") {
        return "Reset sent as undefined";
    }
    return "Default props";
}

export function SweepGradientResetPlayground() {
    const center = useSharedValue<Vector | undefined>(undefined);
    const positions = useSharedValue<number[] | undefined>(undefined);
    const [state, setState] = useState<DemoState>("default");

    const applyCustom = () => {
        center.value = { x: "22%", y: "28%" };
        positions.value = [0, 0.12, 0.55, 1];
        setState("custom");
    };

    const reset = () => {
        center.value = undefined;
        positions.value = undefined;
        setState("reset");
    };

    return (
        <DemoCard
            title="Shared Value Reset"
            preview={
                <SweepGradient
                    style={previewStyles.preview}
                    colors={colors}
                    center={center}
                    positions={positions}
                >
                    <View style={styles.overlay}>
                        <Text style={styles.eyebrow}>Optional Props</Text>
                        <Text style={styles.title}>Center + Positions</Text>
                        <Text style={styles.note}>
                            Sends `undefined` through the conic gradient native
                            update path.
                        </Text>
                        <Text style={styles.status}>{labelFor(state)}</Text>
                    </View>
                </SweepGradient>
            }
        >
            <ControlRow>
                <Chip
                    label="Apply custom"
                    onPress={applyCustom}
                    active={state === "custom"}
                />
                <Chip
                    label="Reset to default"
                    onPress={reset}
                    active={state === "reset"}
                />
            </ControlRow>
        </DemoCard>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        gap: 4,
    },
    eyebrow: {
        color: "rgba(255, 249, 239, 0.78)",
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    title: {
        color: "#fffaf2",
        fontSize: 20,
        fontWeight: "900",
    },
    note: {
        color: "rgba(255, 250, 242, 0.88)",
        fontSize: 13,
        lineHeight: 18,
        maxWidth: 240,
    },
    status: {
        marginTop: 8,
        alignSelf: "flex-start",
        borderRadius: 999,
        backgroundColor: "rgba(255, 250, 242, 0.18)",
        color: palette.page,
        fontSize: 12,
        fontWeight: "800",
        overflow: "hidden",
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
});
