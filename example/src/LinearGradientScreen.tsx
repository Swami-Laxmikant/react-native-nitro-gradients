import { DemoScreen } from "./demo-ui";
import { LinearGradientPlayground } from "./gradient-sections/LinearGradientPlayground";
import { LinearGradientReanimatedPlayground } from "./gradient-sections/LinearGradientReanimatedPlayground";
import { LinearGradientResetPlayground } from "./gradient-sections/LinearGradientResetPlayground";
import { LinearGradientVectorPlayground } from "./gradient-sections/LinearGradientVectorPlayground";

export function LinearGradientScreen() {
    return (
        <DemoScreen
            eyebrow="Axial"
            title="Linear Gradient"
            description="Direction, color stops, and blur on a straight axis."
        >
            <LinearGradientPlayground />
            <LinearGradientReanimatedPlayground />
            <LinearGradientResetPlayground />
            <LinearGradientVectorPlayground />
        </DemoScreen>
    );
}
