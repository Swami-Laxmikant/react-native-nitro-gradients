import { DemoScreen } from "./demo-ui";
import {
    RadialGradientBoundsPlayground,
    RadialGradientBoundsReanimatedPlayground,
} from "./gradient-sections/RadialGradientBoundsPlayground";
import { RadialGradientDynamicSharedValuePlayground } from "./gradient-sections/RadialGradientDynamicSharedValuePlayground";
import { RadialGradientPalettePlayground } from "./gradient-sections/RadialGradientPalettePlayground";
import { RadialGradientPlayground } from "./gradient-sections/RadialGradientPlayground";
import { RadialGradientReanimatedPlayground } from "./gradient-sections/RadialGradientReanimatedPlayground";
import { RadialGradientResetPlayground } from "./gradient-sections/RadialGradientResetPlayground";

export function RadialGradientScreen() {
    return (
        <DemoScreen
            eyebrow="Orbital"
            title="Radial Gradient"
            description="Focal point, radius envelope, and blur on a circular falloff."
        >
            <RadialGradientPlayground />
            <RadialGradientReanimatedPlayground />
            <RadialGradientBoundsPlayground />
            <RadialGradientBoundsReanimatedPlayground />
            <RadialGradientDynamicSharedValuePlayground />
            <RadialGradientResetPlayground />
            <RadialGradientPalettePlayground />
        </DemoScreen>
    );
}
