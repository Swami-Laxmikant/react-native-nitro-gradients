import Foundation
import UIKit
import NitroModules

class HybridLinearGradientView: HybridLinearGradientViewSpec {
    
    // MARK: - Private Properties
    
    private let gradientView: UIView
    private let gradientLayer = CAGradientLayer()
    let view: UIView
    
    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [NSNumber] = []
    private var lastBounds: CGRect = .zero
    private var isLayoutValid = false
    
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
    
    var angle: Double? = nil {
        didSet {
            if oldValue != angle {
                let bounds = gradientView.bounds
                if bounds.width > 0 && bounds.height > 0, let angle = angle {
                    setPointsFromAngle(angle: angle, width: bounds.width, height: bounds.height)
                }
                isDirty = true
            }
        }
    }
    
    var start: Vector? = Vector(x: .second(0.0), y: .second(0.0)) {
        didSet {
            if angle != nil {
                return
            }
            if !vectorsEqual(oldValue, start) {
                isDirty = true
            }
        }
    }
    
    var end: Vector? = Vector(x: .second(1.0), y: .second(0.0)) {
        didSet {
            if angle != nil {
                return
            }
            if !vectorsEqual(oldValue, end) {
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
        
        gradientLayer.type = .axial
        gradientLayer.contentsScale = UIScreen.main.scale
        
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
                if let angle = angle {
                    setPointsFromAngle(angle: angle, width: bounds.width, height: bounds.height)
                }
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
    
    func update(colors: Variant_NullType__Double_?, positions: [Double]?, start: Vector?, end: Vector?, angle: Double?) throws {
        var changed = false
        
        if let colorsVariant = colors, case .second(let colorsArray) = colorsVariant, !self.colors.elementsEqual(colorsArray) {
            self.colors = colorsArray
            changed = true
        }
        if let positions = positions, !arraysEqual(self.positions, positions) {
            self.positions = positions
            changed = true
        }
        
        if let angle = angle {
            if self.angle != angle {
                self.angle = angle
                changed = true
            }
        }
        
        if self.angle == nil {
            if let start = start, !vectorsEqual(self.start, start) {
                self.start = start
                changed = true
            }
            if let end = end, !vectorsEqual(self.end, end) {
                self.end = end
                changed = true
            }
        }
        
        if changed {
            updateGradient()
        }
    }
    
    // MARK: - Gradient Updates
    
    private func computeLocations() -> [NSNumber] {
        if let positions = positions, !positions.isEmpty {
            return positions.map { NSNumber(value: $0) }
        }
        guard !colors.isEmpty else { return [0, 1] }
        let step = 1.0 / Double(max(1, colors.count - 1))
        return (0..<colors.count).map { NSNumber(value: Double($0) * step) }
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
        
        let startValue = start ?? Vector(x: .second(0.0), y: .second(0.0))
        let endValue = end ?? Vector(x: .second(1.0), y: .second(0.0))
        
        gradientLayer.startPoint = toNormalizedPoint(value: startValue, width: bounds.width, height: bounds.height)
        gradientLayer.endPoint = toNormalizedPoint(value: endValue, width: bounds.width, height: bounds.height)
        
        CATransaction.commit()
    }
    
    private func setPointsFromAngle(angle: Double, width: CGFloat, height: CGFloat) {
        if width == 0 || height == 0 {
            return
        }
        
        // Negate to reverse rotation direction for iOS
        let adjustedAngle = CGFloat(angle) - 90
        let cx = width / 2
        let cy = height / 2
        let relativeStartPoint = getGradientStartPoint(angle: adjustedAngle, hWidth: cx, hHeight: cy)
        
        // Convert to absolute coordinates
        // iOS coordinate system: Y increases downward, so we add instead of subtract
        let absoluteStartX = cx + relativeStartPoint.0
        let absoluteStartY = cy + relativeStartPoint.1  // Changed: add instead of subtract
        let absoluteEndX = cx - relativeStartPoint.0
        let absoluteEndY = cy - relativeStartPoint.1    // Changed: subtract instead of add
        
        // Store as absolute pixel values (toNormalizedCoordinate will convert them to 0-1)
        start = Vector(x: .second(Double(absoluteStartX)), y: .second(Double(absoluteStartY)))
        end = Vector(x: .second(Double(absoluteEndX)), y: .second(Double(absoluteEndY)))
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
