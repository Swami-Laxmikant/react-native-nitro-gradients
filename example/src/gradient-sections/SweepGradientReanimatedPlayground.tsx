import { useState } from "react";
import { SweepGradient, type Vector } from "react-native-nitro-gradients";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    SharedValueSlider,
} from "../demo-ui";
import { previewStyles } from "./shared";

export function SweepGradientReanimatedPlayground() {
    const centerX = useSharedValue(50);
    const centerY = useSharedValue(50);
    const pos0 = useSharedValue(0);
    const pos1 = useSharedValue(0.25);
    const pos2 = useSharedValue(0.75);
    const pos3 = useSharedValue(1);
    const blur = useSharedValue(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const center = useDerivedValue<Vector>(() => ({
        x: `${centerX.value}%`,
        y: `${centerY.value}%`,
    }));
    const positions = useDerivedValue(() => [
        pos0.value,
        pos1.value,
        pos2.value,
        pos3.value,
    ]);

    return (
        <Section title="Reanimated Playground">
            <DemoCard
                preview={
                    <SweepGradient
                        style={previewStyles.preview}
                        colors={["#f26852", "#f6c261", "#5a7dff", "#f26852"]}
                        center={center}
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
                <SharedValueSlider label="Stop 1" value={pos0} />
                <SharedValueSlider label="Stop 2" value={pos1} />
                <SharedValueSlider label="Stop 3" value={pos2} />
                <SharedValueSlider label="Stop 4" value={pos3} />
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
