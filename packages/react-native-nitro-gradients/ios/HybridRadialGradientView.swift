import Foundation
import UIKit
import NitroModules

class HybridRadialGradientView: HybridRadialGradientViewSpec {
    
    // MARK: - Private Properties
    
    private let gradientView: UIView
    private let gradientLayer = RadialGradientLayer()
    let view: UIView
    
    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [CGFloat] = []
    private var lastBounds: CGRect = .zero
    private var isLayoutValid = false
    private var hasCustomRadius: Bool = false
    
    // MARK: - Protocol Properties
    
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
    
    var center: Vector? = Vector(x: .first("50%"), y: .first("50%")) {
        didSet {
            if !vectorsEqual(oldValue, center) {
                isDirty = true
            }
        }
    }

    var radius: Variant_String_Double? = .first("50%") {
        didSet {
            hasCustomRadius = true
            if !variantsEqual(oldValue, radius) {
                isDirty = true
            }
        }
    }
    
    // MARK: - Initialization
    
    override init() {
        self.gradientView = UIView()
        self.view = gradientView
        super.init()
        
        setupGradient()
        isDirty = true
        
        DispatchQueue.main.async { [weak self] in
            self?.updateGradient()
        }
    }
    
    // MARK: - Setup
    
    private func setupGradient() {
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
    
    // MARK: - Bounds Handling
    
    private func handleBoundsChange() {
        let bounds = gradientView.bounds
        if bounds != lastBounds {
            lastBounds = bounds
            
            if bounds.width > 0 && bounds.height > 0 && !isLayoutValid {
                isLayoutValid = true
                isDirty = true
                updateGradient()
                updateGradientFrame()
            } else if isLayoutValid {
                isDirty = true
                updateGradientFrame()
            }
        }
    }
    
    // MARK: - Update Interface
    
    func update(colors: Variant_NullType__Double_?, positions: [Double]?, center: Vector?, radius: Variant_String_Double?) throws {
        var changed = false
        
        if let colorsVariant = colors, case .second(let colorsArray) = colorsVariant, !self.colors.elementsEqual(colorsArray) {
            self.colors = colorsArray
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
        if let radius = radius, !variantsEqual(self.radius, radius) {
            self.radius = radius
            self.hasCustomRadius = true
            changed = true
        }
        
        if changed {
            updateGradient()
        }
    }
    
    // MARK: - Gradient Updates
    
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
        
        let centerValue = center ?? Vector(x: .first("50%"), y: .first("50%"))
        gradientLayer.center = toCGPoint(value: centerValue, width: bounds.width, height: bounds.height)
        
        if hasCustomRadius, let radius = radius {
            let r = toCGFloat(value: radius, width: bounds.width, height: bounds.height, fm: bounds.width)
            gradientLayer.radius = CGSize(width: r, height: r)
        } else {
            let m = min(bounds.width, bounds.height) / 2.0
            gradientLayer.radius = CGSize(width: m, height: m)
        }
        
        CATransaction.commit()
        gradientLayer.setNeedsDisplay()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// MARK: - Radial Gradient Layer

private final class RadialGradientLayer: CALayer {
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
