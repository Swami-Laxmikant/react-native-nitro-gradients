import { Pressable, StyleSheet, Text } from "react-native";
import { palette } from "./theme";

type ChipProps = {
    label: string;
    active?: boolean;
    onPress: () => void;
};

export function Chip({ label, active = false, onPress }: ChipProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                active ? styles.chipActive : null,
                pressed ? styles.chipPressed : null,
            ]}
        >
            <Text
                style={[
                    styles.chipLabel,
                    active ? styles.chipLabelActive : null,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: palette.stroke,
        backgroundColor: "#fff",
    },
    chipActive: {
        backgroundColor: palette.ink,
        borderColor: palette.ink,
    },
    chipPressed: {
        opacity: 0.84,
    },
    chipLabel: {
        color: palette.ink,
        fontSize: 13,
        fontWeight: "700",
    },
    chipLabelActive: {
        color: "#fff8ef",
    },
});
