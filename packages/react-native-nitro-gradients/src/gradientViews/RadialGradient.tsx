// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React, { useMemo } from "react";
import type { ColorValue, ViewProps } from "react-native";
import { View } from "react-native";
import { getHostComponent } from "react-native-nitro-modules";
import RadialGradientViewConfig from "../../nitrogen/generated/shared/json/RadialGradientViewConfig.json";
import type {
    RadialGradientViewMethods,
    RadialGradientViewProps,
} from "../specs/RadialGradient.nitro";
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

const RadialGradientView = getHostComponent<
    RadialGradientViewProps,
    RadialGradientViewMethods
>("RadialGradientView", () => RadialGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<RadialGradientViewProps, "colors" | "tileMode"> & {
        colors: ColorValue[];
        tileMode?: TileMode;
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useRadialGradient = (
    colors: Props["colors"],
    center: Props["center"],
    radius: Props["radius"],
    positions: Props["positions"],
    blur: Props["blur"],
    tileMode: Props["tileMode"],
) => {
    const gradProps = useMemo(
        () => ({
            positions: getValue(positions) || [],
            colors: processColors(getValue(colors)),
            center: getValue(center),
            radius: getValue(radius),
            blur: getValue(blur),
            tileMode: getValue(tileMode),
        }),
        [colors, center, radius, positions, blur, tileMode],
    );

    const [gradRef, setGradRef] = useAnimatedNitroViewRef<
        RadialGradientViewProps,
        RadialGradientViewMethods
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
            getValue(radius),
            getValue(blur),
            getValue(tileMode),
        );
    });

    return {
        gradProps,
        setGradRef,
    };
};

export const RadialGradient = ({
    colors,
    center,
    radius,
    positions,
    blur,
    tileMode,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useRadialGradient(
        colors,
        center,
        radius,
        positions,
        blur,
        tileMode,
    );

    return (
        <View {...viewProps}>
            <RadialGradientView
                style={commonStyles.gradientView}
                hybridRef={setGradRef}
                {...gradProps}
            />
            {children}
        </View>
    );
};
