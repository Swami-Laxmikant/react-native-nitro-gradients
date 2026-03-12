import { useState } from "react";
import type { ColorValue } from "react-native";
import {
    RadialGradient,
    type RadiusValue,
    type Vector,
} from "react-native-nitro-gradients";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    SharedValueSlider,
} from "../demo-ui";
import {
    getRadialColors,
    getRadialPositions,
    paletteLimits,
} from "./paletteUtils";
import { previewStyles } from "./shared";

export function RadialGradientPalettePlayground() {
    const centerX = useSharedValue(50);
    const centerY = useSharedValue(50);
    const radius = useSharedValue(140);
    const colorCount = useSharedValue(4);
    const blur = useSharedValue(0);
    const colors = useSharedValue<ColorValue[]>(getRadialColors(4));
    const positions = useSharedValue(getRadialPositions(4));
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const center = useDerivedValue<Vector>(() => ({
        x: `${centerX.value}%`,
        y: `${centerY.value}%`,
    }));
    const radiusValue = useDerivedValue<RadiusValue>(() => radius.value);

    const updateColorCount = (nextValue: number) => {
        const count = Math.round(nextValue);
        colors.value = getRadialColors(count);
        positions.value = getRadialPositions(count);
    };

    return (
        <Section title="Center & Dynamic Colors">
            <DemoCard
                preview={
                    <RadialGradient
                        style={previewStyles.preview}
                        colors={colors}
                        positions={positions}
                        center={center}
                        radius={radiusValue}
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
                    label="Radius"
                    value={radius}
                    min={20}
                    max={300}
                    step={1}
                />
                <SharedValueSlider
                    label="Color Count"
                    value={colorCount}
                    min={2}
                    max={paletteLimits.radial}
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
