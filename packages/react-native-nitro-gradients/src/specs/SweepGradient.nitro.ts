import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { VectorR } from "./helperTypes";

export interface SweepGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    center?: VectorR;
    startAngle?: number;
    endAngle?: number;
}

export interface SweepGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        center?: VectorR,
        startAngle?: number,
        endAngle?: number,
    ): void;
}

export type SweepGradientView = HybridView<
    SweepGradientViewProps,
    SweepGradientViewMethods
>;
