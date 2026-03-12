import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { TileModeValue, Vector } from "./helperTypes";

export interface LinearGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    start?: Vector;
    end?: Vector;
    angle?: number;
    blur?: number;
    tileMode?: TileModeValue;
}

export interface LinearGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        start?: Vector,
        end?: Vector,
        angle?: number,
        blur?: number,
        tileMode?: TileModeValue,
    ): void;
}

export type LinearGradientView = HybridView<
    LinearGradientViewProps,
    LinearGradientViewMethods
>;
