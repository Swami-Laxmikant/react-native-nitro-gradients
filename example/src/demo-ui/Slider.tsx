import RNSlider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { formatSliderValue, sliderStyles } from "./sliderShared";
import { palette } from "./theme";

type SliderProps = {
    label: string;
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange: (value: number) => void;
};

export function Slider({
    label,
    value,
    min = 0,
    max = 1,
    step,
    onValueChange,
}: SliderProps) {
    return (
        <View style={sliderStyles.sliderRow}>
            <View style={sliderStyles.sliderHeader}>
                <Text numberOfLines={2} style={sliderStyles.sliderLabel}>
                    {label}
                </Text>
                <Text numberOfLines={1} style={sliderStyles.sliderValue}>
                    {formatSliderValue(value, max, step)}
                </Text>
            </View>
            <View style={sliderStyles.sliderTrack}>
                <RNSlider
                    value={value}
                    minimumValue={min}
                    maximumValue={max}
                    step={step}
                    onValueChange={onValueChange}
                    minimumTrackTintColor={palette.accent}
                    maximumTrackTintColor={palette.stroke}
                    thumbTintColor={palette.accent}
                    style={sliderStyles.slider}
                />
            </View>
        </View>
    );
}
