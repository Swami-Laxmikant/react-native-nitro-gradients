// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React, { useMemo } from "react";
import type { ColorValue, ViewProps } from "react-native";
import { View } from "react-native";
import { getHostComponent } from "react-native-nitro-modules";
import SweepGradientViewConfig from "../../nitrogen/generated/shared/json/SweepGradientViewConfig.json";
import type {
    SweepGradientViewMethods,
    SweepGradientViewProps,
} from "../specs/SweepGradient.nitro";
import { commonStyles } from "./styles";
import {
    getValue,
    processColors,
    useAnimatedNitroViewRef,
    useSharedValuesEffect,
    type WithSharedValueObj,
} from "./utils";

const SweepGradientView = getHostComponent<
    SweepGradientViewProps,
    SweepGradientViewMethods
>("SweepGradientView", () => SweepGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<SweepGradientViewProps, "colors"> & {
        colors: ColorValue[];
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useSweepGradient = (
    colors: Props["colors"],
    center: Props["center"],
    positions: Props["positions"],
) => {
    const gradProps = useMemo(
        () => ({
            positions: getValue(positions),
            colors: processColors(getValue(colors)),
            center: getValue(center),
        }),
        [colors, center, positions],
    );

    const [gradRef, setGradRef] = useAnimatedNitroViewRef<
        SweepGradientViewProps,
        SweepGradientViewMethods
    >();

    useSharedValuesEffect(() => {
        "worklet";
        if (!gradRef.value) {
            return;
        }
        gradRef.value.update(
            processColors(getValue(colors)),
            getValue(positions),
            getValue(center),
        );
    });

    return {
        gradProps,
        setGradRef,
    };
};

type Pretify<T> = {
    [k in keyof T]: T[k];
};

export const SweepGradient = ({
    colors,
    center,
    positions,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useSweepGradient(
        colors,
        center,
        positions,
    );

    return (
        <View {...viewProps}>
            <SweepGradientView
                style={commonStyles.gradientView}
                hybridRef={setGradRef}
                {...gradProps}
            />
            {children}
        </View>
    );
};
