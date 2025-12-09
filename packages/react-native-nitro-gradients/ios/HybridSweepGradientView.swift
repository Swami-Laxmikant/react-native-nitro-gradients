import Foundation
import UIKit
import NitroModules

class HybridSweepGradientView: HybridSweepGradientViewSpec {
    
    // MARK: - Private Properties
    
    private let gradientView: UIView
    private let gradientLayer = CAGradientLayer()
    let view: UIView
    
    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [NSNumber] = []
    private var lastBounds: CGRect = .zero
    private var isLayoutValid = false
    
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
        
        // Configure conic (sweep) gradient
        gradientLayer.type = .conic
        gradientLayer.contentsScale = UIScreen.main.scale
        gradientLayer.isOpaque = false
        
        // Default center (0.5, 0.5) and end point at 3 o'clock position
        gradientLayer.startPoint = CGPoint(x: 0.5, y: 0.5)
        gradientLayer.endPoint = CGPoint(x: 0.5, y: 0.0)
        
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
    
    func update(colors: Variant_NullType__Double_?, positions: [Double]?, center: Vector?) throws {
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
        
        let centerValue = center ?? Vector(x: .first("50%"), y: .first("50%"))
        let normalizedCenter = toNormalizedPoint(value: centerValue, width: bounds.width, height: bounds.height)
        gradientLayer.startPoint = normalizedCenter
        
        gradientLayer.endPoint = CGPoint(x: normalizedCenter.x, y: 0.0)
        
        CATransaction.commit()
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
