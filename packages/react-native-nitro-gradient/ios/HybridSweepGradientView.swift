import Foundation
import UIKit
import NitroModules

class HybridSweepGradientView: HybridSweepGradientViewSpec {
    func update(colors: [Double]?, positions: [Double]?, center: VectorR?, startAngle: Double?, endAngle: Double?) throws {
        var changed = false
        
        if let colors = colors, !self.colors.elementsEqual(colors) {
            self.colors = colors
            changed = true
        }
        if let positions = positions, !arraysEqual(self.positions, positions) {
            self.positions = positions
            changed = true
        }
        if let center = center, !vectorsEqual(self.center, center) {
            self.center = center
            changed = true
        }
        if let startAngle = startAngle, self.startAngle != startAngle {
            self.startAngle = startAngle
            changed = true
        }
        if let endAngle = endAngle, self.endAngle != endAngle {
            self.endAngle = endAngle
            changed = true
        }
        
        if changed {
            updateGradient()
        }
    }
    
    private let gradientView: UIView
    private let gradientLayer = SweepGradientLayer()
    let view: UIView
    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [CGFloat] = []
    private var lastBounds: CGRect = .zero
    private var isLayoutValid = false
    
    override init() {
        self.gradientView = UIView()
        self.view = gradientView
        super.init()
        
        setupCustomView()
        isDirty = true
        // Force initial gradient update after a brief delay to ensure layout is ready
        DispatchQueue.main.async { [weak self] in
            self?.updateGradient()
        }
    }
    
    var colors: [Double] = [] {
        didSet {
            if !oldValue.elementsEqual(colors) {
                isDirty = true
                cachedColors = colors.map { parseColorInt($0).cgColor }
            }
        }
    }
    
    var positions: [Double]? = nil {
        didSet {
            if !arraysEqual(oldValue, positions) {
                isDirty = true
                cachedLocations = computeLocations()
            }
        }
    }
    
    var center: VectorR? = VectorR(x: .first("50%"), y: .first("50%")) {
        didSet {
            if !vectorsEqual(oldValue, center) {
                isDirty = true
            }
        }
    }

    var startAngle: Double? = 0.0 {
        didSet {
            if oldValue != startAngle {
                isDirty = true
            }
        }
    }
    
    var endAngle: Double? = 360.0 {
        didSet {
            if oldValue != endAngle {
                isDirty = true
            }
        }
    }
    
    private func setupCustomView() {
        let customView = CustomGradientView { [weak self] in
            self?.handleBoundsChange()
        }
        
        gradientView.layer.sublayers?.removeAll()
        customView.layer.addSublayer(gradientLayer)
        gradientView.addSubview(customView)
        
        customView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            customView.topAnchor.constraint(equalTo: gradientView.topAnchor),
            customView.leadingAnchor.constraint(equalTo: gradientView.leadingAnchor),
            customView.trailingAnchor.constraint(equalTo: gradientView.trailingAnchor),
            customView.bottomAnchor.constraint(equalTo: gradientView.bottomAnchor)
        ])
    }
    
    private func handleBoundsChange() {
        let bounds = gradientView.bounds
        if bounds != lastBounds {
            lastBounds = bounds
            
            // On first valid layout, ensure gradient is updated
            if bounds.width > 0 && bounds.height > 0 && !isLayoutValid {
                isLayoutValid = true
                isDirty = true
                updateGradient()
                updateGradientFrame()
            } else if isLayoutValid {
                // On subsequent layout changes
                isDirty = true
                updateGradientFrame()
            }
        }
    }
    
    private func computeLocations() -> [CGFloat] {
        if let positions = positions, !positions.isEmpty {
            return positions.map { CGFloat($0) }
        }
        guard !colors.isEmpty else { return [] }
        let step = 1.0 / Double(max(1, colors.count - 1))
        return (0..<colors.count).map { CGFloat(Double($0) * step) }
    }
    
    private func updateGradient() {
        guard isDirty else { return }
        
        if cachedColors.isEmpty {
            cachedColors = colors.map { parseColorInt($0).cgColor }
        }
        if cachedLocations.isEmpty {
            cachedLocations = computeLocations()
        }
        
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        gradientLayer.colors = cachedColors
        gradientLayer.locations = cachedLocations
        CATransaction.commit()
        
        updateGradientFrame()
        isDirty = false
    }
    
    private func updateGradientFrame() {
        let bounds = gradientView.bounds
        
        guard bounds.width > 0 && bounds.height > 0 else { return }
        
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        gradientLayer.frame = bounds
        
        let centerValue = center ?? VectorR(x: .first("50%"), y: .first("50%"))
        gradientLayer.center = toCGPoint(value: centerValue, width: bounds.width, height: bounds.height)
        
        // Convert angles from degrees to radians
        let startAngleDegrees = CGFloat(startAngle ?? 0.0)
        let endAngleDegrees = CGFloat(endAngle ?? 360.0)
        gradientLayer.startAngle = startAngleDegrees * .pi / 180.0
        gradientLayer.endAngle = endAngleDegrees * .pi / 180.0
        
        CATransaction.commit()
        gradientLayer.setNeedsDisplay()
    }
    
    private func arraysEqual(_ a: [Double]?, _ b: [Double]?) -> Bool {
        guard let a = a, let b = b else { return a == nil && b == nil }
        return a.elementsEqual(b)
    }
    
    private func vectorsEqual(_ a: VectorR?, _ b: VectorR?) -> Bool {
        guard let a = a, let b = b else { return a == nil && b == nil }
        return variantsEqual(a.x, b.x) && variantsEqual(a.y, b.y)
    }
    
    private func variantsEqual(_ a: Variant_String_Double?, _ b: Variant_String_Double?) -> Bool {
        guard let a = a, let b = b else { return a == nil && b == nil }
        switch (a, b) {
        case (.first(let s1), .first(let s2)): return s1 == s2
        case (.second(let d1), .second(let d2)): return d1 == d2
        default: return false
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

private final class SweepGradientLayer: CALayer {
    var colors: [CGColor] = [UIColor.clear.cgColor, UIColor.clear.cgColor]
    var locations: [CGFloat] = [0, 1]
    var center: CGPoint = .zero
    var startAngle: CGFloat = 0
    var endAngle: CGFloat = 2 * .pi

    override init() {
        super.init()
        setupLayer()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupLayer()
    }

    override init(layer: Any) {
        if let l = layer as? SweepGradientLayer {
            self.colors = l.colors
            self.locations = l.locations
            self.center = l.center
            self.startAngle = l.startAngle
            self.endAngle = l.endAngle
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
        
        // Calculate the angle range
        var totalAngle = endAngle - startAngle
        // Normalize the angle range
        while totalAngle < 0 {
            totalAngle += 2 * .pi
        }
        while totalAngle > 2 * .pi {
            totalAngle -= 2 * .pi
        }
        
        // Number of segments to approximate the sweep gradient
        let segments = max(360, Int(totalAngle * 180 / .pi))
        let angleStep = totalAngle / CGFloat(segments)
        
        ctx.saveGState()
        
        // Draw the sweep gradient using pie slices
        for i in 0..<segments {
            let angle1 = startAngle + angleStep * CGFloat(i)
            let angle2 = startAngle + angleStep * CGFloat(i + 1)
            
            // Calculate the color for this segment
            let progress = CGFloat(i) / CGFloat(segments)
            let color = interpolateColor(at: progress, colors: colors, locations: cgLocations)
            
            ctx.setFillColor(color)
            
            // Create a pie slice path
            ctx.move(to: center)
            
            // Calculate the maximum radius (diagonal of the bounds)
            let maxRadius = sqrt(pow(bounds.width, 2) + pow(bounds.height, 2))
            
            let x1 = center.x + cos(angle1) * maxRadius
            let y1 = center.y + sin(angle1) * maxRadius
            let x2 = center.x + cos(angle2) * maxRadius
            let y2 = center.y + sin(angle2) * maxRadius
            
            ctx.addLine(to: CGPoint(x: x1, y: y1))
            ctx.addLine(to: CGPoint(x: x2, y: y2))
            ctx.closePath()
            ctx.fillPath()
        }
        
        ctx.restoreGState()
    }
    
    private func interpolateColor(at progress: CGFloat, colors: [CGColor], locations: [CGFloat]) -> CGColor {
        guard colors.count > 0 else { return UIColor.clear.cgColor }
        guard colors.count > 1 else { return colors[0] }
        
        let locs = locations.isEmpty ? defaultLocations(count: colors.count) : locations
        
        // Find the two colors to interpolate between
        var lowerIndex = 0
        var upperIndex = 1
        
        for i in 0..<locs.count {
            if progress >= locs[i] {
                lowerIndex = i
                if i + 1 < locs.count {
                    upperIndex = i + 1
                } else {
                    upperIndex = i
                }
            }
        }
        
        if lowerIndex == upperIndex {
            return colors[lowerIndex]
        }
        
        let lowerLoc = locs[lowerIndex]
        let upperLoc = locs[upperIndex]
        let range = upperLoc - lowerLoc
        
        guard range > 0 else { return colors[lowerIndex] }
        
        let localProgress = (progress - lowerLoc) / range
        
        // Interpolate between the two colors
        let color1 = colors[lowerIndex]
        let color2 = colors[upperIndex]
        
        guard let components1 = color1.components,
              let components2 = color2.components else {
            return color1
        }
        
        let r = components1[0] + (components2[0] - components1[0]) * localProgress
        let g = components1[1] + (components2[1] - components1[1]) * localProgress
        let b = components1[2] + (components2[2] - components1[2]) * localProgress
        let a = components1[3] + (components2[3] - components1[3]) * localProgress
        
        return UIColor(red: r, green: g, blue: b, alpha: a).cgColor
    }

    private func defaultLocations(count: Int) -> [CGFloat] {
        guard count > 1 else { return [0, 1] }
        let step = 1.0 / CGFloat(max(1, count - 1))
        return (0..<count).map { CGFloat($0) * step }
    }
}

