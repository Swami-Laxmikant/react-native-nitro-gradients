// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React, { useState } from "react";
import type { ColorValue, ViewProps } from "react-native";
import { View } from "react-native";
import { getHostComponent } from "react-native-nitro-modules";
import LinearGradientViewConfig from "../../nitrogen/generated/shared/json/LinearGradientViewConfig.json";
import type {
    LinearGradientViewMethods,
    LinearGradientViewProps,
} from "../specs/LinearGradient.nitro";
import { commonStyles } from "./styles";
import type { TileMode } from "./types";
import {
    getValue,
    type Pretify,
    processColors,
    useAnimatedNitroViewRef,
    useSharedValuesEffect,
    type WithSharedValueObj,
} from "./utils";

const LinearGradientView = getHostComponent<
    LinearGradientViewProps,
    LinearGradientViewMethods
>("LinearGradientView", () => LinearGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<LinearGradientViewProps, "colors" | "tileMode"> & {
        colors: ColorValue[];
        tileMode?: TileMode;
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useLinearGradient = (
    colors: Props["colors"],
    start: Props["start"],
    end: Props["end"],
    positions: Props["positions"],
    angle: Props["angle"],
    blur: Props["blur"],
    tileMode: Props["tileMode"],
) => {
    const gradProps = useState(() => ({
        positions: getValue(positions),
        colors: processColors(getValue(colors)),
        start: getValue(start),
        end: getValue(end),
        angle: getValue(angle),
        blur: getValue(blur),
        tileMode: getValue(tileMode),
    }))[0];

    const [gradRef, setGradRef] = useAnimatedNitroViewRef<
        LinearGradientViewProps,
        LinearGradientViewMethods
    >();

    useSharedValuesEffect(
        () => {
            "worklet";
            if (!gradRef.value) {
                return;
            }
            gradRef.value.update(
                processColors(getValue(colors)),
                getValue(positions),
                getValue(start),
                getValue(end),
                getValue(angle),
                getValue(blur),
                getValue(tileMode),
            );
        },
        colors,
        start,
        end,
        positions,
        angle,
        blur,
        tileMode,
    );

    return {
        gradProps,
        setGradRef,
    };
};

export const LinearGradient = ({
    colors,
    start,
    end,
    positions,
    angle,
    blur,
    tileMode,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useLinearGradient(
        colors,
        start,
        end,
        positions,
        angle,
        blur,
        tileMode,
    );

    return (
        <View {...viewProps}>
            <LinearGradientView
                style={commonStyles.fullSize}
                hybridRef={setGradRef}
                {...gradProps}
            />
            {children}
        </View>
    );
};
