import { useState } from "react";
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
import { previewStyles } from "./shared";

export function RadialGradientReanimatedPlayground() {
    const centerX = useSharedValue(50);
    const centerY = useSharedValue(50);
    const radius = useSharedValue(120);
    const pos0 = useSharedValue(0);
    const pos1 = useSharedValue(0.42);
    const pos2 = useSharedValue(1);
    const blur = useSharedValue(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const center = useDerivedValue<Vector>(() => ({
        x: `${centerX.value}%`,
        y: `${centerY.value}%`,
    }));
    const radiusValue = useDerivedValue<RadiusValue>(() => radius.value);
    const positions = useDerivedValue(() => [
        pos0.value,
        pos1.value,
        pos2.value,
    ]);

    return (
        <Section title="Reanimated Playground">
            <DemoCard
                preview={
                    <RadialGradient
                        style={previewStyles.preview}
                        colors={["#fff1d3", "#ff9a6c", "#24113b"]}
                        center={center}
                        radius={radiusValue}
                        positions={positions}
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
                    min={10}
                    max={300}
                    step={1}
                />
                <SharedValueSlider label="Stop 1" value={pos0} />
                <SharedValueSlider label="Stop 2" value={pos1} />
                <SharedValueSlider label="Stop 3" value={pos2} />
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
