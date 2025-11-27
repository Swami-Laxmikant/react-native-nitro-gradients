// biome-ignore lint/correctness/noUnusedImports: Needed for JSX runtime
import React, { useMemo } from "react";
import type { ColorValue, ViewProps } from "react-native";
import { View } from "react-native";
import { getHostComponent } from "react-native-nitro-modules";
import { useAnimatedReaction } from "react-native-reanimated";
import LinearGradientViewConfig from "../../nitrogen/generated/shared/json/LinearGradientViewConfig.json";
import type {
    LinearGradientViewMethods,
    LinearGradientViewProps,
} from "../specs/LinearGradient.nitro";
import { commonStyles } from "./styles";
import {
    getValue,
    processColors,
    useAnimatedNitroViewRef,
    type WithSharedValueObj,
} from "./utils";

const LinearGradientView = getHostComponent<
    LinearGradientViewProps,
    LinearGradientViewMethods
>("LinearGradientView", () => LinearGradientViewConfig);

type GradientViewProps = WithSharedValueObj<
    Omit<LinearGradientViewProps, "colors"> & {
        colors: ColorValue[];
    }
>;

type _Props = GradientViewProps & ViewProps;

type Props = Pretify<_Props>;

const useLinearGradient = (
    colors: Props["colors"],
    start: Props["start"],
    end: Props["end"],
    positions: Props["positions"],
) => {
    const gradProps = useMemo(
        () => ({
            positions: getValue(positions),
            colors: processColors(getValue(colors)),
            start: getValue(start),
            end: getValue(end),
        }),
        [colors, start, end, positions],
    );

    const [gradRef, setGradRef] = useAnimatedNitroViewRef<
        LinearGradientViewProps,
        LinearGradientViewMethods
    >();

    useAnimatedReaction(() => ({ colors, start, end, positions }), () => {
        if (!gradRef.value) {
            return;
        }
        gradRef.value.update(
            processColors(getValue(colors)),
            getValue(positions),
            getValue(start),
            getValue(end),
        );
    }, [colors, start, end, positions]);

    return {
        gradProps,
        setGradRef,
    };
};

type Pretify<T> = {
    [k in keyof T]: T[k];
};

export const LinearGradient = ({
    colors,
    start,
    end,
    positions,
    children,
    ...viewProps
}: Props) => {
    const { gradProps, setGradRef } = useLinearGradient(
        colors,
        start,
        end,
        positions,
    );

    return (
        <View {...viewProps}>
            <LinearGradientView
                style={commonStyles.gradientView}
                hybridRef={setGradRef}
                {...gradProps}
            />
            {children}
        </View>
    );
};
