import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { Vector } from "./helperTypes";

export interface LinearGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    start?: Vector;
    end?: Vector;
    angle?: number;
}

export interface LinearGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        start?: Vector,
        end?: Vector,
        angle?: number,
    ): void;
}

export type LinearGradientView = HybridView<
    LinearGradientViewProps,
    LinearGradientViewMethods
>;
