import { useState } from "react";
import { RadialGradient } from "react-native-nitro-gradients";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    Slider,
} from "../demo-ui";

const COLORS = ["#f26852", "#f6c261", "#5a7dff", "#f26852"] as const;

export function RadialGradientBoundsPlayground() {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(180);

    return (
        <Section title="Bounds Change (Stateful)">
            <DemoCard
                preview={
                    <RadialGradient
                        style={{
                            width,
                            height,
                            alignSelf: "center",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                        colors={[...COLORS]}
                    />
                }
            >
                <Slider
                    label="Width"
                    value={width}
                    min={40}
                    max={350}
                    step={1}
                    onValueChange={setWidth}
                />
                <Slider
                    label="Height"
                    value={height}
                    min={40}
                    max={350}
                    step={1}
                    onValueChange={setHeight}
                />
            </DemoCard>
        </Section>
    );
}

export function RadialGradientBoundsReanimatedPlayground() {
    const widthSV = useSharedValue(100);
    const heightSV = useSharedValue(180);
    const [size, setSize] = useState<"small" | "medium" | "large">("medium");

    const animatedStyle = useAnimatedStyle(() => ({
        width: withTiming(widthSV.value, { duration: 400 }),
        height: withTiming(heightSV.value, { duration: 400 }),
        alignSelf: "center" as const,
        borderRadius: 12,
        overflow: "hidden" as const,
    }));

    const applySize = (s: "small" | "medium" | "large") => {
        setSize(s);
        switch (s) {
            case "small":
                widthSV.value = 80;
                heightSV.value = 80;
                break;
            case "medium":
                widthSV.value = 180;
                heightSV.value = 180;
                break;
            case "large":
                widthSV.value = 320;
                heightSV.value = 260;
                break;
        }
    };

    return (
        <Section title="Bounds Change (Reanimated)">
            <DemoCard
                preview={
                    <Animated.View style={animatedStyle}>
                        <RadialGradient
                            style={{ flex: 1 }}
                            colors={[...COLORS]}
                        />
                    </Animated.View>
                }
            >
                <ControlRow>
                    <Chip
                        label="Small"
                        active={size === "small"}
                        onPress={() => applySize("small")}
                    />
                    <Chip
                        label="Medium"
                        active={size === "medium"}
                        onPress={() => applySize("medium")}
                    />
                    <Chip
                        label="Large"
                        active={size === "large"}
                        onPress={() => applySize("large")}
                    />
                </ControlRow>
            </DemoCard>
        </Section>
    );
}
