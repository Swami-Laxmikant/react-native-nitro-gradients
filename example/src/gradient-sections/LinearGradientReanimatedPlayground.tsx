import { useState } from "react";
import { LinearGradient } from "react-native-nitro-gradients";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import {
    Chip,
    ControlRow,
    DemoCard,
    Section,
    SharedValueSlider,
} from "../demo-ui";
import { previewStyles } from "./shared";

export function LinearGradientReanimatedPlayground() {
    const angle = useSharedValue(135);
    const pos0 = useSharedValue(0);
    const pos1 = useSharedValue(0.5);
    const pos2 = useSharedValue(1);
    const blur = useSharedValue(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    const positions = useDerivedValue(() => [
        pos0.value,
        pos1.value,
        pos2.value,
    ]);

    return (
        <Section title="Reanimated Playground">
            <DemoCard
                preview={
                    <LinearGradient
                        style={previewStyles.preview}
                        colors={["#1f2a44", "#f4c26b", "#f2efe8"]}
                        angle={angle}
                        positions={positions}
                        blur={blur}
                        tileMode={tileMode}
                    />
                }
            >
                <SharedValueSlider
                    label="Angle"
                    value={angle}
                    min={0}
                    max={360}
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
