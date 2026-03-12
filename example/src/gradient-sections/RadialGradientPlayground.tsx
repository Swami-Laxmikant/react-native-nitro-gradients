import { useState } from "react";
import { RadialGradient } from "react-native-nitro-gradients";
import { Chip, ControlRow, DemoCard, Section, Slider } from "../demo-ui";
import { previewStyles } from "./shared";

export function RadialGradientPlayground() {
    const [centerX, setCenterX] = useState(50);
    const [centerY, setCenterY] = useState(50);
    const [radius, setRadius] = useState(120);
    const [pos0, setPos0] = useState(0);
    const [pos1, setPos1] = useState(0.42);
    const [pos2, setPos2] = useState(1);
    const [blur, setBlur] = useState(0);
    const [tileMode, setTileMode] = useState<"clamp" | "decal">("clamp");

    return (
        <Section title="Stateful Playground">
            <DemoCard
                preview={
                    <RadialGradient
                        style={previewStyles.preview}
                        colors={["#fff1d3", "#ff9a6c", "#24113b"]}
                        center={{ x: `${centerX}%`, y: `${centerY}%` }}
                        radius={radius}
                        positions={[pos0, pos1, pos2]}
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
                <Slider
                    label="Radius"
                    value={radius}
                    min={10}
                    max={300}
                    step={1}
                    onValueChange={setRadius}
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
