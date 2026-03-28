import { useState } from "react";
import { LinearGradient, type Vector } from "react-native-nitro-gradients";
import {
    useSharedValue,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";
import { Chip, ControlRow, DemoCard, Section, Slider } from "../demo-ui";
import { previewStyles } from "./shared";

const COLORS = ["#f26852", "#f6c261", "#5a7dff", "#f26852"] as const;

type Mode = "static" | "shared";

export function LinearGradientDynamicSharedValuePlayground() {
    const [mode, setMode] = useState<Mode>("static");
    const [staticStartY, setStaticStartY] = useState(0);

    const sharedStartY = useSharedValue(0);

    const sharedStart = useDerivedValue<Vector>(() => ({
        x: "0%",
        y: `${sharedStartY.value}%`,
    }));

    const staticStart = { x: "0%", y: `${staticStartY}%` };

    const switchToShared = () => {
        sharedStartY.value = staticStartY;
        setMode("shared");
    };

    const switchToStatic = () => {
        setStaticStartY(Math.round(sharedStartY.value));
        setMode("static");
    };

    const animateShared = () => {
        sharedStartY.value = withTiming(
            sharedStartY.value < 50 ? 90 : 10,
            { duration: 800 },
        );
    };

    return (
        <Section title="Dynamic Shared Value">
            <DemoCard
                preview={
                    <LinearGradient
                        style={previewStyles.preview}
                        colors={[...COLORS]}
                        start={mode === "shared" ? sharedStart : staticStart}
                    />
                }
            >
                <ControlRow>
                    <Chip
                        label="Static"
                        active={mode === "static"}
                        onPress={switchToStatic}
                    />
                    <Chip
                        label="Shared Value"
                        active={mode === "shared"}
                        onPress={switchToShared}
                    />
                    {mode === "shared" && (
                        <Chip
                            label="Animate"
                            active={false}
                            onPress={animateShared}
                        />
                    )}
                </ControlRow>
                {mode === "static" && (
                    <Slider
                        label="Start Y"
                        value={staticStartY}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={setStaticStartY}
                    />
                )}
            </DemoCard>
        </Section>
    );
}
