import { useState } from "react";
import type { ColorValue } from "react-native";
import { LinearGradient, type Vector } from "react-native-nitro-gradients";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    SharedValueSlider,
} from "../demo-ui";
import {
    getLinearColors,
    getLinearPositions,
    paletteLimits,
} from "./paletteUtils";
import { previewStyles } from "./shared";

export function LinearGradientVectorPlayground() {
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const endX = useSharedValue(100);
    const endY = useSharedValue(100);
    const colorCount = useSharedValue(4);
    const blur = useSharedValue(0);
    const colors = useSharedValue<ColorValue[]>(getLinearColors(4));
    const positions = useSharedValue(getLinearPositions(4));
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const start = useDerivedValue<Vector>(() => ({
        x: `${startX.value}%`,
        y: `${startY.value}%`,
    }));
    const end = useDerivedValue<Vector>(() => ({
        x: `${endX.value}%`,
        y: `${endY.value}%`,
    }));

    const updateColorCount = (nextValue: number) => {
        const count = Math.round(nextValue);
        colors.value = getLinearColors(count);
        positions.value = getLinearPositions(count);
    };

    return (
        <Section title="Start / End Vectors">
            <DemoCard
                preview={
                    <LinearGradient
                        style={previewStyles.preview}
                        colors={colors}
                        positions={positions}
                        start={start}
                        end={end}
                        blur={blur}
                        tileMode={tileMode}
                    />
                }
            >
                <SharedValueSlider
                    label="Start X"
                    value={startX}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="Start Y"
                    value={startY}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="End X"
                    value={endX}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="End Y"
                    value={endY}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="Color Count"
                    value={colorCount}
                    min={2}
                    max={paletteLimits.linear}
                    step={1}
                    onValueChange={updateColorCount}
                />
                <SharedValueSlider
                    label="Blur"
                    value={blur}
                    min={0}
                    max={64}
                    step={1}
                />
                <ControlRow>
                    <Chip
                        label="Clamp"
                        active={tileMode === "clamp"}
                        onPress={() => setTileMode("clamp")}
                    />
                    <Chip
                        label="Decal"
                        active={tileMode === "decal"}
                        onPress={() => setTileMode("decal")}
                    />
                </ControlRow>
            </DemoCard>
        </Section>
    );
}
