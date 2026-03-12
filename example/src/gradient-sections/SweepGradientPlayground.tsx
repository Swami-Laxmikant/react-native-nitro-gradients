import { useState } from "react";
import { SweepGradient } from "react-native-nitro-gradients";
import { Chip, ControlRow, DemoCard, Section, Slider } from "../demo-ui";
import { previewStyles } from "./shared";

export function SweepGradientPlayground() {
    const [centerX, setCenterX] = useState(50);
    const [centerY, setCenterY] = useState(50);
    const [pos0, setPos0] = useState(0);
    const [pos1, setPos1] = useState(0.25);
    const [pos2, setPos2] = useState(0.75);
    const [pos3, setPos3] = useState(1);
    const [blur, setBlur] = useState(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    return (
        <Section title="Stateful Playground">
            <DemoCard
                preview={
                    <SweepGradient
                        style={previewStyles.preview}
                        colors={["#f26852", "#f6c261", "#5a7dff", "#f26852"]}
                        center={{ x: `${centerX}%`, y: `${centerY}%` }}
                        positions={[pos0, pos1, pos2, pos3]}
                        blur={blur}
                        tileMode={tileMode}
                    />
                }
            >
                <Slider
                    label="Center X"
                    value={centerX}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={setCenterX}
                />
                <Slider
                    label="Center Y"
                    value={centerY}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={setCenterY}
                />
                <Slider label="Stop 1" value={pos0} onValueChange={setPos0} />
                <Slider label="Stop 2" value={pos1} onValueChange={setPos1} />
                <Slider label="Stop 3" value={pos2} onValueChange={setPos2} />
                <Slider label="Stop 4" value={pos3} onValueChange={setPos3} />
                <Slider
                    label="Blur"
                    value={blur}
                    min={0}
                    max={48}
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
