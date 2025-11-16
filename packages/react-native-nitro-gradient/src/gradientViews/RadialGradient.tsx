// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React, { useMemo } from "react";
import type { ColorValue, ViewProps } from "react-native";
import { View } from "react-native";
import { getHostComponent } from "react-native-nitro-modules";
import { useAnimatedReaction } from "react-native-reanimated";
import RadialGradientViewConfig from "../../nitrogen/generated/shared/json/RadialGradientViewConfig.json";
import type {
    RadialGradientViewMethods,
    RadialGradientViewProps,
} from "../specs/RadialGradient.nitro";
import { commonStyles } from "./styles";
import {
    getValue,
    processColors,
    useAnimatedNitroViewRef,
    type WithSharedValueObj,
} from "./utils";

const RadialGradientView = getHostComponent<
    RadialGradientViewProps,
    RadialGradientViewMethods
>("RadialGradientView", () => RadialGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<RadialGradientViewProps, "colors"> & {
        colors: ColorValue[];
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useRadialGradient = (
    colors: Props["colors"],
    center: Props["center"],
    radius: Props["radius"],
    positions: Props["positions"],
) => {
    const gradProps = useMemo(
        () => ({
            positions: getValue(positions) || [],
            colors: processColors(getValue(colors)),
            center: getValue(center),
            radius: getValue(radius),
        }),
        [colors, center, radius, positions],
    );

    const [gradRef, setGradRef] = useAnimatedNitroViewRef<
        RadialGradientViewProps,
        RadialGradientViewMethods
    >();

    useAnimatedReaction(() => ({ colors, center, radius, positions }), () => {
        if (!gradRef.value) {
            return;
        }
        gradRef.value.update(
            processColors(getValue(colors)),
            getValue(positions) || [],
            getValue(center) || null,
            getValue(radius) ?? null,
        );
    }, [colors, center, radius, positions]);

    return {
        gradProps,
        setGradRef,
    };
};

type Pretify<T> = {
    [k in keyof T]: T[k];
};

export const RadialGradient = ({
    colors,
    center,
    radius,
    positions,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useRadialGradient(
        colors,
        center,
        radius,
        positions,
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
