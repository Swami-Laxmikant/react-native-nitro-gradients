import { useState } from "react";
import { LinearGradient } from "react-native-nitro-gradients";
import { Chip, ControlRow, DemoCard, Section, Slider } from "../demo-ui";
import { previewStyles } from "./shared";

export function LinearGradientPlayground() {
    const [angle, setAngle] = useState(135);
    const [pos0, setPos0] = useState(0);
    const [pos1, setPos1] = useState(0.5);
    const [pos2, setPos2] = useState(1);
    const [blur, setBlur] = useState(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    return (
        <Section title="Stateful Playground">
            <DemoCard
                preview={
                    <LinearGradient
                        style={previewStyles.preview}
                        colors={["#1f2a44", "#f4c26b", "#f2efe8"]}
                        angle={angle}
                        positions={[pos0, pos1, pos2]}
                        blur={blur}
                        tileMode={tileMode}
                    />
                }
            >
                <Slider
                    label="Angle"
                    value={angle}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={setAngle}
                />
                <Slider label="Stop 1" value={pos0} onValueChange={setPos0} />
                <Slider label="Stop 2" value={pos1} onValueChange={setPos1} />
                <Slider label="Stop 3" value={pos2} onValueChange={setPos2} />
                <Slider
                    label="Blur"
                    value={blur}
                    min={0}
                    max={64}
                    step={1}
                    onValueChange={setBlur}
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
