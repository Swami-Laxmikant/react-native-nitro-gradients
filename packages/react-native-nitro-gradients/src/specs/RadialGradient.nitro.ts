import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { RadiusValue, TileModeValue, Vector } from "./helperTypes";

export interface RadialGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    center?: Vector;
    radius?: RadiusValue;
    blur?: number;
    tileMode?: TileModeValue;
}

export interface RadialGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        center?: Vector,
        radius?: RadiusValue,
        blur?: number,
        tileMode?: TileModeValue,
    ): void;
}

export type RadialGradientView = HybridView<
    RadialGradientViewProps,
    RadialGradientViewMethods
>;
