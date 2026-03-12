import {
    Children,
    isValidElement,
    type PropsWithChildren,
    type ReactNode,
} from "react";
import {
    Platform,
    type StyleProp,
    StyleSheet,
    Text,
    View,
    type ViewStyle,
} from "react-native";
import { ControlRow } from "./ControlRow";
import { palette } from "./theme";

const isIOS = Platform.OS === "ios";

type DemoCardProps = PropsWithChildren<{
    title?: string;
    preview: ReactNode;
    previewStyle?: StyleProp<ViewStyle>;
}>;

export function DemoCard({
    title,
    preview,
    children,
    previewStyle,
}: DemoCardProps) {
    const items = Children.toArray(children);
    const sliderItems = items.filter(
        (child) => !isValidElement(child) || child.type !== ControlRow,
    );
    const controlRows = items.filter(
        (child) => isValidElement(child) && child.type === ControlRow,
    );

    return (
        <View style={styles.card}>
            {title ? <Text style={styles.cardTitle}>{title}</Text> : null}
            <View style={[styles.previewShell, previewStyle]}>{preview}</View>
            {children ? (
                <View style={styles.controls}>
                    {sliderItems.length > 0 ? (
                        <View style={styles.sliderRail}>{sliderItems}</View>
                    ) : null}
                    {controlRows}
                </View>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: palette.stroke,
        padding: 14,
        gap: 14,
    },
    cardTitle: {
        color: palette.ink,
        fontSize: 16,
        fontWeight: "800",
        paddingHorizontal: 2,
    },
    previewShell: {
        minHeight: 180,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: palette.surfaceStrong,
        borderWidth: 1,
        borderColor: "#d1c0a7",
        justifyContent: "center",
    },
    controls: {
        gap: 8,
    },
    sliderRail: {
        flexDirection: isIOS ? "row" : "column",
        gap: isIOS ? 6 : 10,
        alignItems: isIOS ? "flex-start" : "stretch",
        width: "100%",
    },
});
