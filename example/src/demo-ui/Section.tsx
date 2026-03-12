import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette } from "./theme";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

export function Section({ title, children }: SectionProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: 10,
    },
    sectionTitle: {
        color: palette.ink,
        fontSize: 18,
        fontWeight: "800",
        paddingHorizontal: 2,
    },
});
