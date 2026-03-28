import { useState } from "react";
import { SweepGradient, type Vector } from "react-native-nitro-gradients";
import {
    useSharedValue,
    useDerivedValue,
    withTiming,
} from "react-native-reanimated";
import { Chip, ControlRow, DemoCard, Section, Slider } from "../demo-ui";
import { previewStyles } from "./shared";

const COLORS = ["#f26852", "#f6c261", "#5a7dff", "#f26852"] as const;

type Mode = "static" | "shared";

export function SweepGradientDynamicSharedValuePlayground() {
    const [mode, setMode] = useState<Mode>("static");
    const [staticCenterX, setStaticCenterX] = useState(50);

    const sharedCenterX = useSharedValue(50);

    const sharedCenter = useDerivedValue<Vector>(() => ({
        x: `${sharedCenterX.value}%`,
        y: "50%",
    }));

    const staticCenter = { x: `${staticCenterX}%`, y: "50%" };

    const switchToShared = () => {
        sharedCenterX.value = staticCenterX;
        setMode("shared");
    };

    const switchToStatic = () => {
        setStaticCenterX(Math.round(sharedCenterX.value));
        setMode("static");
    };

    const animateShared = () => {
        sharedCenterX.value = withTiming(
            sharedCenterX.value < 50 ? 90 : 10,
            { duration: 800 },
        );
    };

    return (
        <Section title="Dynamic Shared Value">
            <DemoCard
                preview={
                    <SweepGradient
                        style={previewStyles.preview}
                        colors={[...COLORS]}
                        center={mode === "shared" ? sharedCenter : staticCenter}
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
                        label="Center X"
                        value={staticCenterX}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={setStaticCenterX}
                    />
                )}
            </DemoCard>
        </Section>
    );
}
