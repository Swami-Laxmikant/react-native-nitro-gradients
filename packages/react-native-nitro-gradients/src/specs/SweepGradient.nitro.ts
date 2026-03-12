import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { TileModeValue, Vector } from "./helperTypes";

export interface SweepGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    center?: Vector;
    blur?: number;
    tileMode?: TileModeValue;
}

export interface SweepGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        center?: Vector,
        blur?: number,
        tileMode?: TileModeValue,
    ): void;
}

export type SweepGradientView = HybridView<
    SweepGradientViewProps,
    SweepGradientViewMethods
>;
