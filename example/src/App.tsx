import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation, useIsFocused } from "@react-navigation/native";
import type React from "react";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SweepGradient } from "react-native-nitro-gradients";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { palette } from "./demo-ui";
import { LinearGradientScreen } from "./LinearGradientScreen";
import { RadialGradientScreen } from "./RadialGradientScreen";
import { SweepGradientScreen } from "./SweepGradientScreen";

function Icon({
    name,
    size,
}: {
    name: "linear" | "radial" | "sweep";
    size: number;
}) {
    const isFocused = useIsFocused();
    const progress = useSharedValue(isFocused ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isFocused ? 1 : 0, {
            damping: 14,
            stiffness: 180,
        });
    }, [isFocused, progress]);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: 0.45 + progress.value * 0.55,
        transform: [
            { scale: 0.82 + progress.value * 0.18 },
            { rotate: `${progress.value * 18}deg` },
        ],
    }));

    return (
        <Animated.View
            style={[
                styles.iconShell,
                {
                    width: size + 10,
                    height: size + 10,
                    borderRadius: (size + 10) / 2,
                },
                animatedStyles,
            ]}
        >
            {name === "linear" ? (
                <View style={styles.iconFill}>
                    <View style={styles.linearTrack} />
                    <View style={styles.linearGlyph} />
                </View>
            ) : null}
            {name === "radial" ? (
                <View style={styles.iconFill}>
                    <View style={styles.radialGlyphOuter}>
                        <View style={styles.radialGlyphInner} />
                    </View>
                    <View style={styles.radialGlow} />
                </View>
            ) : null}
            {name === "sweep" ? (
                <SweepGradient
                    style={styles.iconFill}
                    colors={["#b46f35", "#ead7bc", "#cf9b61", "#b46f35"]}
                    center={{ x: "50%", y: "50%" }}
                >
                    <View style={styles.sweepWash} />
                    <View style={styles.sweepGlyph}>
                        <View style={[styles.sweepArmWrap, styles.sweepArmUp]}>
                            <View style={styles.sweepArm} />
                        </View>
                        <View
                            style={[styles.sweepArmWrap, styles.sweepArmLeft]}
                        >
                            <View style={styles.sweepArm} />
                        </View>
                        <View
                            style={[styles.sweepArmWrap, styles.sweepArmRight]}
                        >
                            <View style={styles.sweepArm} />
                        </View>
                        <View style={styles.sweepHub} />
                    </View>
                </SweepGradient>
            ) : null}
        </Animated.View>
    );
}

const Tabs = createBottomTabNavigator({
    detachInactiveScreens: false,
    screenOptions: {
        headerStyle: {
            backgroundColor: palette.surface,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
            color: palette.ink,
            fontSize: 18,
            fontWeight: "800",
        },
        headerTitleAlign: "center",
        sceneStyle: {
            backgroundColor: palette.page,
        },
        tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.stroke,
            height: 74,
            paddingBottom: 10,
            paddingTop: 8,
        },
        tabBarActiveTintColor: palette.ink,
        tabBarInactiveTintColor: "#9f917d",
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 0.2,
        },
    },
    screens: {
        Linear: {
            screen: LinearGradientScreen,
            options: {
                title: "Linear",
                headerTitle: "Linear Gradient",
                tabBarIcon: ({ size }) => <Icon name="linear" size={size} />,
            },
        },
        Radial: {
            screen: RadialGradientScreen,
            options: {
                title: "Radial",
                headerTitle: "Radial Gradient",
                tabBarIcon: ({ size }) => <Icon name="radial" size={size} />,
            },
        },
        Sweep: {
            screen: SweepGradientScreen,
            options: {
                title: "Sweep",
                headerTitle: "Sweep Gradient",
                tabBarIcon: ({ size }) => <Icon name="sweep" size={size} />,
            },
        },
    },
});

const Navigation = createStaticNavigation(Tabs);

function App(): React.JSX.Element {
    return <Navigation />;
}

const styles = StyleSheet.create({
    iconShell: {
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#d8c9b4",
        backgroundColor: "#fff8ef",
    },
    iconFill: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5ead7",
    },
    linearTrack: {
        position: "absolute",
        width: 22,
        height: 22,
        borderRadius: 999,
        backgroundColor: "#e7d6bf",
    },
    linearGlyph: {
        width: 18,
        height: 4,
        borderRadius: 999,
        backgroundColor: "#8f5a28",
        transform: [{ rotate: "-28deg" }],
    },
    radialGlyphOuter: {
        width: 16,
        height: 16,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: "#8f5a28",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff8ef",
    },
    radialGlyphInner: {
        width: 4,
        height: 4,
        borderRadius: 999,
        backgroundColor: "#8f5a28",
    },
    radialGlow: {
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#d8b58c",
    },
    sweepGlyph: {
        position: "relative",
        width: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    sweepWash: {
        position: "absolute",
        width: 22,
        height: 22,
        borderRadius: 999,
        backgroundColor: "rgba(255, 248, 239, 0.26)",
    },
    sweepArmWrap: {
        position: "absolute",
        inset: 0,
    },
    sweepArmUp: {
        transform: [{ rotate: "0deg" }],
    },
    sweepArmLeft: {
        transform: [{ rotate: "-120deg" }],
    },
    sweepArmRight: {
        transform: [{ rotate: "120deg" }],
    },
    sweepArm: {
        position: "absolute",
        width: 3,
        height: 10,
        borderRadius: 999,
        backgroundColor: "#8f5a28",
        top: 1,
        left: "50%",
        marginLeft: -1.5,
    },
    sweepHub: {
        position: "absolute",
        width: 5,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#8f5a28",
    },
});

export default App;
