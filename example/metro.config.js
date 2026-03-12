const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appNodeModules = path.resolve(__dirname, "node_modules");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    watchFolders: [root],
    resolver: {
        disableHierarchicalLookup: true,
        extraNodeModules: {
            react: path.join(appNodeModules, "react"),
            "react-native": path.join(appNodeModules, "react-native"),
            "react-native-nitro-modules": path.join(
                appNodeModules,
                "react-native-nitro-modules",
            ),
            "react-native-reanimated": path.join(
                appNodeModules,
                "react-native-reanimated",
            ),
            "react-native-worklets": path.join(
                appNodeModules,
                "react-native-worklets",
            ),
        },
        nodeModulesPaths: [appNodeModules, path.resolve(root, "node_modules")],
    },

    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
