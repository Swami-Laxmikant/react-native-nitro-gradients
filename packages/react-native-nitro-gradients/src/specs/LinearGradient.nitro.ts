import type {
    HybridView,
    HybridViewMethods,
    HybridViewProps,
} from "react-native-nitro-modules";
import type { VectorR } from "./helperTypes";

export interface LinearGradientViewProps extends HybridViewProps {
    colors: number[];
    positions?: number[];
    start?: VectorR;
    end?: VectorR;
}

export interface LinearGradientViewMethods extends HybridViewMethods {
    update(
        colors: number[] | null,
        positions?: number[],
        start?: VectorR,
        end?: VectorR,
    ): void;
}

export type LinearGradientView = HybridView<
    LinearGradientViewProps,
    LinearGradientViewMethods
>;
