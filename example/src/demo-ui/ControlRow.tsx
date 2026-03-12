import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export function ControlRow({ children }: PropsWithChildren) {
    return <View style={styles.controlRow}>{children}</View>;
}

const styles = StyleSheet.create({
    controlRow: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
});
