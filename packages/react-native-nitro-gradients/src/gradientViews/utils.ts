import { useMemo } from "react";
import type { ColorValue } from "react-native";
import {
    type HybridView as _HybridView,
    type HybridViewMethods,
    type HybridViewProps,
    NitroModules,
} from "react-native-nitro-modules";
import {
    isSharedValue as _isSharedValue,
    type DerivedValue,
    processColor,
    type SharedValue,
    useSharedValue,
} from "react-native-reanimated";
import { runOnUISync } from "react-native-worklets";

type WithSharedValue<T> =
    | T
    | SharedValue<T>
    | DerivedValue<T>
    | SharedValue<Exclude<T, undefined>>
    | DerivedValue<Exclude<T, undefined>>;

export type WithSharedValueObj<T> = { [k in keyof T]: WithSharedValue<T[k]> };

export const isSharedValue = _isSharedValue as <T = unknown>(
    value: unknown,
) => value is
    | SharedValue<T>
    | DerivedValue<T>
    | SharedValue<Exclude<T, undefined>>
    | DerivedValue<Exclude<T, undefined>>;

export const getValue = <T>(value: WithSharedValue<T>): T => {
    "worklet";
    return isSharedValue<T>(value) ? value.value : value;
};

export const useAnimatedNitroViewRef = <
    T extends HybridViewProps,
    U extends HybridViewMethods,
>() => {
    type HybridView = _HybridView<T, U>;
    const svRef = useSharedValue<null | HybridView>(null);
    const setRef = useMemo(
        () => ({
            f: (ref: HybridView) => {
                runOnUISync((boxedRef) => {
                    svRef.value = boxedRef.unbox();
                }, NitroModules.box(ref));
            },
        }),
        [svRef],
    );

    return [svRef, setRef] as const;
};

export const processColors = (colors: ColorValue[]) => {
    "worklet";
    return colors.map((it) =>
        typeof it === "number" ? it : processColor(it) || 0,
    );
};
