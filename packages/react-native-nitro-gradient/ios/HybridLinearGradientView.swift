import Foundation
import UIKit
import NitroModules

class HybridLinearGradientView: HybridLinearGradientViewSpec {
    func update(colors: [Double]?, positions: [Double]?, start: VectorR?, end: VectorR?) throws {
        var changed = false
        
        if let colors = colors, !self.colors.elementsEqual(colors) {
            self.colors = colors
            changed = true
        }
        if let positions = positions, !arraysEqual(self.positions, positions) {
            self.positions = positions
            changed = true
        }
        if let start = start, !vectorsEqual(self.start, start) {
            self.start = start
            changed = true
        }
        if let end = end, !vectorsEqual(self.end, end) {
            self.end = end
            changed = true
        }
        
        if changed {
            updateGradient()
        }
    }
    
    private let gradientView: UIView
    private let gradientLayer = CAGradientLayer()
    let view: UIView
    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [NSNumber] = []
    private var lastBounds: CGRect = .zero
    private var isLayoutValid = false
    
    override init() {
        self.gradientView = UIView()
        self.view = gradientView
        super.init()
        
        setupCustomView()
        isDirty = true
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
    
    var start: VectorR? = VectorR(x: .second(0.0), y: .second(0.0)) {
        didSet {
            if !vectorsEqual(oldValue, start) {
                isDirty = true
            }
        }
    }
    
    var end: VectorR? = VectorR(x: .second(1.0), y: .second(0.0)) {
        didSet {
            if !vectorsEqual(oldValue, end) {
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
        
        gradientLayer.type = .axial
    }
    
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
        
        // Convert VectorR to normalized points (0-1) for CAGradientLayer
        let startValue = start ?? VectorR(x: .second(0.0), y: .second(0.0))
        let endValue = end ?? VectorR(x: .second(1.0), y: .second(0.0))
        
        gradientLayer.startPoint = toNormalizedPoint(value: startValue, width: bounds.width, height: bounds.height)
        gradientLayer.endPoint = toNormalizedPoint(value: endValue, width: bounds.width, height: bounds.height)
        
        CATransaction.commit()
    }
    
    private func toNormalizedPoint(value: VectorR, width: CGFloat, height: CGFloat) -> CGPoint {
        let x = toNormalizedCoordinate(value: value.x, dimension: width)
        let y = toNormalizedCoordinate(value: value.y, dimension: height)
        return CGPoint(x: x, y: y)
    }
    
    private func toNormalizedCoordinate(value: Variant_String_Double, dimension: CGFloat) -> CGFloat {
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

