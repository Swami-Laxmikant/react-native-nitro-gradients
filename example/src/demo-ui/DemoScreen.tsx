import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { palette } from "./theme";

type DemoScreenProps = PropsWithChildren<{
    eyebrow: string;
    title: string;
    description: string;
}>;

export function DemoScreen({
    eyebrow,
    title,
    description,
    children,
}: DemoScreenProps) {
    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        >
            <View style={styles.hero}>
                <Text style={styles.eyebrow}>{eyebrow}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.page,
    },
    content: {
        padding: 20,
        gap: 20,
        paddingBottom: 40,
    },
    hero: {
        backgroundColor: palette.surface,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: palette.stroke,
        padding: 20,
        gap: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 3,
    },
    eyebrow: {
        color: palette.accent,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1.6,
        textTransform: "uppercase",
    },
    title: {
        color: palette.ink,
        fontSize: 30,
        fontWeight: "800",
        letterSpacing: -0.8,
    },
    description: {
        color: palette.inkSoft,
        fontSize: 15,
        lineHeight: 22,
    },
});
