import { DemoScreen } from "./demo-ui";
import { SweepGradientPalettePlayground } from "./gradient-sections/SweepGradientPalettePlayground";
import { SweepGradientPlayground } from "./gradient-sections/SweepGradientPlayground";
import { SweepGradientReanimatedPlayground } from "./gradient-sections/SweepGradientReanimatedPlayground";
import { SweepGradientResetPlayground } from "./gradient-sections/SweepGradientResetPlayground";

export function SweepGradientScreen() {
    return (
        <DemoScreen
            eyebrow="Conic"
            title="Sweep Gradient"
            description="Circular rhythm and chromatic rotation around a pivot."
        >
            <SweepGradientPlayground />
            <SweepGradientReanimatedPlayground />
            <SweepGradientResetPlayground />
            <SweepGradientPalettePlayground />
        </DemoScreen>
    );
}
