import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { RadiusValue, VectorR } from "./helperTypes";

export interface RadialGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    center?: VectorR;
    radius?: RadiusValue;
}

export interface RadialGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        center?: VectorR,
        radius?: RadiusValue,
    ): void;
}

export type RadialGradientView = HybridView<
    RadialGradientViewProps,
    RadialGradientViewMethods
>;
