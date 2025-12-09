import UIKit
import NitroModules

// MARK: - Value Conversion

func toCGFloat(value: Variant_String_Double, width: CGFloat, height: CGFloat, fm: CGFloat) -> CGFloat {
    switch value {
    case .first(let s):
        if s.hasSuffix("w%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01) * width
        } else if s.hasSuffix("h%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01) * height
        } else if s.hasSuffix("%"), let num = Double(s.dropLast(1)) {
            return CGFloat(num * 0.01) * fm
        }
        return CGFloat(0)
    case .second(let v):
        return CGFloat(v)
    }
}

func toCGPoint(value: Vector, width: CGFloat, height: CGFloat) -> CGPoint {
    return CGPoint(
        x: toCGFloat(value: value.x, width: width, height: height, fm: width),
        y: toCGFloat(value: value.y, width: width, height: height, fm: height)
    )
}

/// Converts a Vector to a normalized point (0-1 range) for CAGradientLayer
func toNormalizedPoint(value: Vector, width: CGFloat, height: CGFloat) -> CGPoint {
    let x = toNormalizedCoordinate(value: value.x, dimension: width)
    let y = toNormalizedCoordinate(value: value.y, dimension: height)
    return CGPoint(x: x, y: y)
}

/// Converts a single dimension value to normalized (0-1) coordinate
func toNormalizedCoordinate(value: Variant_String_Double, dimension: CGFloat) -> CGFloat {
    switch value {
    case .first(let s):
        // Handle percentage strings: "50%", "50w%", "50h%"
        if s.hasSuffix("%"), let num = Double(s.dropLast(1)) {
            return CGFloat(num * 0.01)
        } else if s.hasSuffix("w%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01)
        } else if s.hasSuffix("h%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01)
        }
        return 0
    case .second(let v):
        // Numeric values are absolute pixels, convert to normalized (0-1)
        guard dimension > 0 else { return 0 }
        return CGFloat(v) / dimension
    }
}

// MARK: - Color Parsing

func parseColorInt(_ color: Double) -> UIColor {
    let rgba = UInt64(color)
    let a = CGFloat((rgba & 0xFF000000) >> 24) / 255.0
    let r = CGFloat((rgba & 0x00FF0000) >> 16) / 255.0
    let g = CGFloat((rgba & 0x0000FF00) >> 8) / 255.0
    let b = CGFloat(rgba & 0x000000FF) / 255.0
    return UIColor(red: r, green: g, blue: b, alpha: a)
}

// MARK: - Equality Helpers

func arraysEqual(_ a: [Double]?, _ b: [Double]?) -> Bool {
    guard let a = a, let b = b else { return a == nil && b == nil }
    return a.elementsEqual(b)
}

func vectorsEqual(_ a: Vector?, _ b: Vector?) -> Bool {
    guard let a = a, let b = b else { return a == nil && b == nil }
    return variantsEqual(a.x, b.x) && variantsEqual(a.y, b.y)
}

func variantsEqual(_ a: Variant_String_Double?, _ b: Variant_String_Double?) -> Bool {
    guard let a = a, let b = b else { return a == nil && b == nil }
    switch (a, b) {
    case (.first(let s1), .first(let s2)): return s1 == s2
    case (.second(let d1), .second(let d2)): return d1 == d2
    default: return false
    }
}

// MARK: - Angle Calculation Helpers

private func getHorizontalOrVerticalStartPoint(angle: CGFloat, halfWidth: CGFloat, halfHeight: CGFloat) -> (CGFloat, CGFloat) {
    if angle == 0 {
        // Horizontal, left-to-right
        return (-halfWidth, 0)
    } else if angle == 90 {
        // Vertical, bottom-to-top
        return (0, -halfHeight)
    } else if angle == 180 {
        // Horizontal, right-to-left
        return (halfWidth, 0)
    } else {
        // Vertical, top to bottom
        return (0, halfHeight)
    }
}

private func getStartCornerToIntersect(angle: CGFloat, halfWidth: CGFloat, halfHeight: CGFloat) -> (CGFloat, CGFloat) {
    if angle < 90 {
        // Bottom left
        return (-halfWidth, -halfHeight)
    } else if angle < 180 {
        // Bottom right
        return (halfWidth, -halfHeight)
    } else if angle < 270 {
        // Top right
        return (halfWidth, halfHeight)
    } else {
        // Top left
        return (-halfWidth, halfHeight)
    }
}

func getGradientStartPoint(angle: CGFloat, hWidth: CGFloat, hHeight: CGFloat) -> (CGFloat, CGFloat) {
    // Bound angle to [0, 360)
    var angle = angle
    angle = angle.truncatingRemainder(dividingBy: 360)
    if angle < 0 {
        angle += 360
    }
    
    // Explicitly check for horizontal or vertical gradients, as slopes of
    // the gradient line or a line perpendicular will be undefined in that case
    if angle.truncatingRemainder(dividingBy: 90) == 0 {
        return getHorizontalOrVerticalStartPoint(angle: angle, halfWidth: hWidth, halfHeight: hHeight)
    }
    
    // Get the equivalent slope of the gradient line as tan = opposite/adjacent = y/x
    let slope = tan(angle * CGFloat.pi / 180.0)
    
    // Find the start point by computing the intersection of the gradient line
    // and a line perpendicular to it that intersects the nearest corner
    let perpendicularSlope = -1 / slope
    
    // Get the start corner to intersect relative to center, in cartesian space (+y = up)
    let startCorner = getStartCornerToIntersect(angle: angle, halfWidth: hWidth, halfHeight: hHeight)
    
    // Compute b (of y = mx + b) to get the equation for the perpendicular line
    let b = startCorner.1 - perpendicularSlope * startCorner.0
    
    // Solve the intersection of the gradient line and the perpendicular line:
    let startX = b / (slope - perpendicularSlope)
    let startY = slope * startX
    
    return (startX, startY)
}

// MARK: - Custom View for Bounds Observation

class CustomGradientView: UIView {
    private let onBoundsChange: () -> Void
    private var lastBounds: CGRect = .zero
    
    init(onBoundsChange: @escaping () -> Void) {
        self.onBoundsChange = onBoundsChange
        super.init(frame: .zero)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        if bounds != lastBounds {
            lastBounds = bounds
            onBoundsChange()
        }
    }
}
