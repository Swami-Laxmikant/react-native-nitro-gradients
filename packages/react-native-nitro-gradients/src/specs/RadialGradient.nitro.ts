import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { RadiusValue, Vector } from "./helperTypes";

export interface RadialGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    center?: Vector;
    radius?: RadiusValue;
}

export interface RadialGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        center?: Vector,
        radius?: RadiusValue,
    ): void;
}

export type RadialGradientView = HybridView<
    RadialGradientViewProps,
    RadialGradientViewMethods
>;
