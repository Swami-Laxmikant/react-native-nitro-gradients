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
import type { TileMode } from "./types";
import {
    getValue,
    processColors,
    useAnimatedNitroViewRef,
    useSharedValuesEffect,
    type Pretify,
    type WithSharedValueObj,
} from "./utils";

const SweepGradientView = getHostComponent<
    SweepGradientViewProps,
    SweepGradientViewMethods
>("SweepGradientView", () => SweepGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<SweepGradientViewProps, "colors" | "tileMode"> & {
        colors: ColorValue[];
        tileMode?: TileMode;
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useSweepGradient = (
    colors: Props["colors"],
    center: Props["center"],
    positions: Props["positions"],
    blur: Props["blur"],
    tileMode: Props["tileMode"],
) => {
    const gradProps = useMemo(
        () => ({
            positions: getValue(positions),
            colors: processColors(getValue(colors)),
            center: getValue(center),
            blur: getValue(blur),
            tileMode: getValue(tileMode),
        }),
        [colors, center, positions, blur, tileMode],
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
            getValue(blur),
            getValue(tileMode),
        );
    });

    return {
        gradProps,
        setGradRef,
    };
};

export const SweepGradient = ({
    colors,
    center,
    positions,
    blur,
    tileMode,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useSweepGradient(
        colors,
        center,
        positions,
        blur,
        tileMode,
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
