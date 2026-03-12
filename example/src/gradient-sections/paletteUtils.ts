const linearPalette = [
    "#1f2a44",
    "#355c7d",
    "#6c5b7b",
    "#c06c84",
    "#f4c26b",
    "#f2efe8",
] as const;

const radialPalette = [
    "#fff4de",
    "#ffd27b",
    "#ff9a6c",
    "#d96df0",
    "#5b4de3",
    "#24113b",
] as const;

const sweepPalette = [
    "#f26852",
    "#f6c261",
    "#8acb88",
    "#5bc0be",
    "#5a7dff",
    "#9d5cff",
] as const;

function evenlySpaced(count: number) {
    if (count <= 1) {
        return [0];
    }

    return Array.from({ length: count }, (_, index) => index / (count - 1));
}

function takeColors(
    palette: readonly string[],
    count: number,
): readonly string[] {
    return palette.slice(0, Math.max(2, Math.min(count, palette.length)));
}

export function getLinearColors(count: number) {
    return [...takeColors(linearPalette, count)];
}

export function getLinearPositions(count: number) {
    return evenlySpaced(getLinearColors(count).length);
}

export function getRadialColors(count: number) {
    return [...takeColors(radialPalette, count)];
}

export function getRadialPositions(count: number) {
    return evenlySpaced(getRadialColors(count).length);
}

export function getSweepColors(count: number) {
    const colors = [...takeColors(sweepPalette, count)];
    return [...colors, colors[0]];
}

export function getSweepPositions(count: number) {
    return evenlySpaced(getSweepColors(count).length);
}

export const paletteLimits = {
    linear: linearPalette.length,
    radial: radialPalette.length,
    sweep: sweepPalette.length,
} as const;
