import CoreImage
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
        if s.hasSuffix("%"), let num = Double(s.dropLast(1)) {
            return CGFloat(num * 0.01)
        } else if s.hasSuffix("w%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01)
        } else if s.hasSuffix("h%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01)
        }
        return 0
    case .second(let v):
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
        return (-halfWidth, 0)
    } else if angle == 90 {
        return (0, -halfHeight)
    } else if angle == 180 {
        return (halfWidth, 0)
    } else {
        return (0, halfHeight)
    }
}

private func getStartCornerToIntersect(angle: CGFloat, halfWidth: CGFloat, halfHeight: CGFloat) -> (CGFloat, CGFloat) {
    if angle < 90 {
        return (-halfWidth, -halfHeight)
    } else if angle < 180 {
        return (halfWidth, -halfHeight)
    } else if angle < 270 {
        return (halfWidth, halfHeight)
    } else {
        return (-halfWidth, halfHeight)
    }
}

func getGradientStartPoint(angle: CGFloat, hWidth: CGFloat, hHeight: CGFloat) -> (CGFloat, CGFloat) {
    var angle = angle
    angle = angle.truncatingRemainder(dividingBy: 360)
    if angle < 0 {
        angle += 360
    }

    if angle.truncatingRemainder(dividingBy: 90) == 0 {
        return getHorizontalOrVerticalStartPoint(angle: angle, halfWidth: hWidth, halfHeight: hHeight)
    }

    let slope = tan(angle * CGFloat.pi / 180.0)
    let perpendicularSlope = -1 / slope
    let startCorner = getStartCornerToIntersect(angle: angle, halfWidth: hWidth, halfHeight: hHeight)
    let b = startCorner.1 - perpendicularSlope * startCorner.0
    let startX = b / (slope - perpendicularSlope)
    let startY = slope * startX

    return (startX, startY)
}

// MARK: - Blur Support

private let blurContext = CIContext(options: nil)

private func makeBlurredImage(from layer: CALayer, size: CGSize, scale: CGFloat, radius: Double, tileMode: String?) -> UIImage? {
    guard size.width > 0, size.height > 0 else { return nil }

    let format = UIGraphicsImageRendererFormat.default()
    format.scale = scale
    format.opaque = false

    let renderer = UIGraphicsImageRenderer(size: size, format: format)
    let baseImage = renderer.image { context in
        layer.render(in: context.cgContext)
    }

    guard let cgImage = baseImage.cgImage else { return nil }

    let originalExtent = CGRect(
        x: 0, y: 0,
        width: CGFloat(cgImage.width),
        height: CGFloat(cgImage.height)
    )

    var image = CIImage(cgImage: cgImage)
    if (tileMode?.lowercased() ?? "decal") == "clamp" {
        image = image.clampedToExtent()
    }

    guard let blurFilter = CIFilter(name: "CIGaussianBlur") else { return nil }
    blurFilter.setValue(image, forKey: kCIInputImageKey)
    blurFilter.setValue(radius, forKey: kCIInputRadiusKey)

    guard
        let outputImage = blurFilter.outputImage?.cropped(to: originalExtent),
        let outputCGImage = blurContext.createCGImage(outputImage, from: originalExtent)
    else {
        return nil
    }

    return UIImage(cgImage: outputCGImage, scale: scale, orientation: .up)
}

func updateBlurPresentation(
    sourceLayer: CALayer,
    sourceView: UIView,
    imageView: UIImageView,
    radius: Double?,
    tileMode: String?
) {
    guard let radius = radius, radius > 0 else {
        imageView.image = nil
        imageView.isHidden = true
        sourceView.layer.opacity = 1
        return
    }

    let bounds = sourceView.bounds
    guard bounds.width > 0, bounds.height > 0 else {
        imageView.image = nil
        imageView.isHidden = true
        sourceView.layer.opacity = 1
        return
    }

    let scale = sourceView.window?.screen.scale ?? UIScreen.main.scale
    // Temporarily restore opacity so render(in:) captures visible content
    let savedOpacity = sourceView.layer.opacity
    sourceView.layer.opacity = 1
    guard let image = makeBlurredImage(from: sourceLayer, size: bounds.size, scale: scale, radius: radius, tileMode: tileMode) else {
        sourceView.layer.opacity = savedOpacity
        imageView.image = nil
        imageView.isHidden = true
        sourceView.layer.opacity = 1
        return
    }

    imageView.image = image
    imageView.frame = bounds
    imageView.isHidden = false
    sourceView.layer.opacity = 0
}

// MARK: - Gradient View Subclasses (layerClass override)

class AxialGradientLayerView: UIView {
    var onLayout: (() -> Void)?
    var onWindowChange: (() -> Void)?

    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradientLayer: CAGradientLayer { layer as! CAGradientLayer }

    override init(frame: CGRect) {
        super.init(frame: frame)
        gradientLayer.type = .axial
        gradientLayer.contentsScale = UIScreen.main.scale
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil {
            onWindowChange?()
        }
    }
}

class ConicGradientLayerView: UIView {
    var onLayout: (() -> Void)?
    var onWindowChange: (() -> Void)?

    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradientLayer: CAGradientLayer { layer as! CAGradientLayer }

    override init(frame: CGRect) {
        super.init(frame: frame)
        gradientLayer.type = .conic
        gradientLayer.contentsScale = UIScreen.main.scale
        gradientLayer.isOpaque = false
        gradientLayer.startPoint = CGPoint(x: 0.5, y: 0.5)
        gradientLayer.endPoint = CGPoint(x: 0.5, y: 0.0)
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil {
            onWindowChange?()
        }
    }
}

class RadialGradientLayerView: UIView {
    var onLayout: (() -> Void)?
    var onWindowChange: (() -> Void)?

    override class var layerClass: AnyClass { RadialGradientLayer.self }
    var gradientLayer: RadialGradientLayer { layer as! RadialGradientLayer }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }

    override func didMoveToWindow() {
        super.didMoveToWindow()
        if window != nil {
            onWindowChange?()
        }
    }
}

// MARK: - Radial Gradient Layer

final class RadialGradientLayer: CALayer {
    var colors: [CGColor] = [UIColor.clear.cgColor, UIColor.clear.cgColor]
    var locations: [CGFloat] = [0, 1]
    var center: CGPoint = .zero
    var radius: CGSize = .zero

    override init() {
        super.init()
        setupLayer()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupLayer()
    }

    override init(layer: Any) {
        if let l = layer as? RadialGradientLayer {
            self.colors = l.colors
            self.locations = l.locations
            self.center = l.center
            self.radius = l.radius
        }
        super.init(layer: layer)
        setupLayer()
    }

    private func setupLayer() {
        contentsScale = UIScreen.main.scale
        needsDisplayOnBoundsChange = true
        isOpaque = false
        actions = [
            "bounds": NSNull(),
            "position": NSNull(),
            "contents": NSNull(),
            "opacity": NSNull(),
            "transform": NSNull()
        ]
    }

    override func draw(in ctx: CGContext) {
        guard !colors.isEmpty else { return }
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let cgLocations = locations.isEmpty ? defaultLocations(count: colors.count) : locations
        guard let gradient = CGGradient(colorsSpace: colorSpace, colors: colors as CFArray, locations: cgLocations) else { return }

        let maxR = max(radius.width, radius.height)
        guard maxR > 0 else { return }

        let sx = radius.width / maxR
        let sy = radius.height / maxR

        ctx.saveGState()
        ctx.translateBy(x: center.x, y: center.y)
        ctx.scaleBy(x: sx == 0 ? 1 : sx, y: sy == 0 ? 1 : sy)
        ctx.drawRadialGradient(
            gradient,
            startCenter: .zero,
            startRadius: 0,
            endCenter: .zero,
            endRadius: maxR,
            options: [.drawsAfterEndLocation]
        )
        ctx.restoreGState()
    }

    private func defaultLocations(count: Int) -> [CGFloat] {
        guard count > 1 else { return [0, 1] }
        let step = 1.0 / CGFloat(max(1, count - 1))
        return (0..<count).map { CGFloat($0) * step }
    }
}
