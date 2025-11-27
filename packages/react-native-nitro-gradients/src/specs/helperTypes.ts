/**
 * A string representing a percentage value.
 *
 * Supported formats:
 * - `"${number}%"` - percentage of the relevant dimension (width for x, height for y)
 * - `"${number}w%"` - percentage of width (explicit)
 * - `"${number}h%"` - percentage of height (explicit)
 *
 * @example
 * // For x values: "50%" means 50% of width
 * // For y values: "50%" means 50% of height
 * center={{ x: "10%", y: "20%" }} // x = width * 0.1, y = height * 0.2
 *
 * // Explicit dimension override:
 * center={{ x: "10h%", y: "20w%" }} // x = height * 0.1, y = width * 0.2
 */
export type PercentString = string;

export interface VectorR {
    x: number | PercentString;
    y: number | PercentString;
}

/**
 * Radius value for radial gradients.
 *
 * Supported formats:
 * - `number` - absolute pixel value
 * - `"${number}%"` - percentage of min(width, height)
 * - `"${number}w%"` - percentage of width
 * - `"${number}h%"` - percentage of height
 *
 * @example
 * radius={100} // 100 pixels
 * radius={"50%"} // 50% of min(width, height)
 * radius={"80w%"} // 80% of width
 * radius={"60h%"} // 60% of height
 */
export type RadiusValue = number | PercentString;
