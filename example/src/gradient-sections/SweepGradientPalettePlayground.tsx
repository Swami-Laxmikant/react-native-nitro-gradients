import { useState } from "react";
import type { ColorValue } from "react-native";
import { SweepGradient, type Vector } from "react-native-nitro-gradients";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    SharedValueSlider,
} from "../demo-ui";
import {
    getSweepColors,
    getSweepPositions,
    paletteLimits,
} from "./paletteUtils";
import { previewStyles } from "./shared";

export function SweepGradientPalettePlayground() {
    const centerX = useSharedValue(50);
    const centerY = useSharedValue(50);
    const colorCount = useSharedValue(4);
    const blur = useSharedValue(0);
    const colors = useSharedValue<ColorValue[]>(getSweepColors(4));
    const positions = useSharedValue(getSweepPositions(4));
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const center = useDerivedValue<Vector>(() => ({
        x: `${centerX.value}%`,
        y: `${centerY.value}%`,
    }));

    const updateColorCount = (nextValue: number) => {
        const count = Math.round(nextValue);
        colors.value = getSweepColors(count);
        positions.value = getSweepPositions(count);
    };

    return (
        <Section title="Center & Dynamic Colors">
            <DemoCard
                preview={
                    <SweepGradient
                        style={previewStyles.preview}
                        colors={colors}
                        positions={positions}
                        center={center}
                        blur={blur}
                        tileMode={tileMode}
                    />
                }
            >
                <SharedValueSlider
                    label="Center X"
                    value={centerX}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="Center Y"
                    value={centerY}
                    min={0}
                    max={100}
                    step={1}
                />
                <SharedValueSlider
                    label="Color Count"
                    value={colorCount}
                    min={2}
                    max={paletteLimits.sweep}
                    step={1}
                    onValueChange={updateColorCount}
                />
                <SharedValueSlider
                    label="Blur"
                    value={blur}
                    min={0}
                    max={48}
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
