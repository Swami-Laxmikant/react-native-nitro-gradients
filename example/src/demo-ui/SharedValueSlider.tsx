import RNSlider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
    runOnJS,
    type SharedValue,
    useAnimatedReaction,
} from "react-native-reanimated";
import { formatSliderValue, sliderStyles } from "./sliderShared";
import { palette } from "./theme";

type SharedValueSliderProps = {
    label: string;
    value: SharedValue<number>;
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number) => void;
};

export function SharedValueSlider({
    label,
    value,
    min = 0,
    max = 1,
    step,
    onValueChange,
}: SharedValueSliderProps) {
    const [currentValue, setCurrentValue] = useState(value.value);

    useEffect(() => {
        setCurrentValue(value.value);
    }, [value]);

    useAnimatedReaction(
        () => value.value,
        (nextValue, previousValue) => {
            if (nextValue !== previousValue) {
                runOnJS(setCurrentValue)(nextValue);
            }
        },
        [value],
    );

    const handleValueChange = (nextValue: number) => {
        value.value = nextValue;
        setCurrentValue(nextValue);
        onValueChange?.(nextValue);
    };

    return (
        <View style={sliderStyles.sliderRow}>
            <View style={sliderStyles.sliderHeader}>
                <Text numberOfLines={2} style={sliderStyles.sliderLabel}>
                    {label}
                </Text>
                <Text numberOfLines={1} style={sliderStyles.sliderValue}>
                    {formatSliderValue(currentValue, max, step)}
                </Text>
            </View>
            <View style={sliderStyles.sliderTrack}>
                <RNSlider
                    value={currentValue}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    onValueChange={handleValueChange}
                    minimumTrackTintColor={palette.accent}
                    maximumTrackTintColor={palette.stroke}
                    thumbTintColor={palette.accent}
                    style={sliderStyles.slider}
                />
            </View>
        </View>
    );
}
