import Foundation
import UIKit
import NitroModules

class RadialGradientLayerView: UIView, GradientLayerProvider {
    var onLayout: (() -> Void)?
    var onWindowChange: (() -> Void)?

    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradientLayer: CAGradientLayer { layer as! CAGradientLayer }

    override init(frame: CGRect) {
        super.init(frame: frame)
        gradientLayer.type = .radial
        gradientLayer.contentsScale = UIScreen.main.scale
        gradientLayer.isOpaque = false
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

class HybridRadialGradientView: HybridRadialGradientViewSpec {

    private let containerView = UIView()
    private let gradientView = RadialGradientLayerView(frame: .zero)
    private let blurImageView = UIImageView()
    let view: UIView

    private var isDirty = false
    private var cachedColors: [CGColor] = []
    private var cachedLocations: [NSNumber]? = nil
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
                cachedLocations = positions?.map{ NSNumber(value: $0) }
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

    var radius: Variant_String_Double? = nil {
        didSet {
            if !variantsEqual(oldValue, radius) {
                isDirty = true
            }
        }
    }

    var blur: Double? = nil {
        didSet {
            if oldValue != blur { isDirty = true }
        }
    }

    var tileMode: String? = nil {
        didSet {
            if oldValue != tileMode { isDirty = true }
        }
    }

    func afterUpdate() {
        updateGradient()
    }

    override init() {
        self.view = containerView
        super.init()

        gradientView.translatesAutoresizingMaskIntoConstraints = false

        containerView.addSubview(gradientView)

        NSLayoutConstraint.activate([
            gradientView.topAnchor.constraint(equalTo: containerView.topAnchor),
            gradientView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            gradientView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            gradientView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
        ])

        gradientView.onLayout = { [weak self] in
            self?.handleBoundsChange()
        }
        gradientView.onWindowChange = { [weak self] in
            self?.forceRedraw()
        }

        isDirty = true
        DispatchQueue.main.async { [weak self] in
            self?.updateGradient()
        }
    }

    private func forceRedraw() {
        isDirty = true
        isLayoutValid = false
        lastBounds = .zero
        cachedColors = colors.map { parseColorInt($0).cgColor }
        updateGradient()
    }
    
    private func applyBlur(){
        manageBlur(gradientView: gradientView, blur: blur, blurImageView: blurImageView, tileMode: tileMode, containerView: containerView)
    }

    private func handleBoundsChange() {
        let bounds = gradientView.bounds
        if bounds != lastBounds {
            lastBounds = bounds

            if bounds.width > 0 && bounds.height > 0 && !isLayoutValid {
                isLayoutValid = true
                isDirty = true
                updateGradient()
            } else if isLayoutValid {
                isDirty = true
                applyGeomatery()
            }
        }
    }

    func update(colors: [Double], positions: [Double]?, center: Vector?, radius: Variant_String_Double?, blur: Double?, tileMode: String?) throws {
        
        self.colors = colors
        self.positions = positions
        self.center = center
        self.radius = radius
        self.blur = blur
        self.tileMode = tileMode
        
        updateGradient()
    }

    private func updateGradient() {
        guard isDirty else { return }

        let gl = gradientView.gradientLayer

        CATransaction.begin()
        CATransaction.setDisableActions(true)
        gl.colors = cachedColors
        gl.locations = cachedLocations
        applyGeomatery() // TODO: typo
        CATransaction.commit()
        
        applyBlur()

        isDirty = false
    }

    private func applyGeomatery() {
        let bounds = gradientView.bounds
        guard bounds.width > 0 && bounds.height > 0 else { return }

        let gl = gradientView.gradientLayer

        let centerValue = center ?? Vector(x: .first("50%"), y: .first("50%"))
        let startPoint = toNormalizedPoint(value: centerValue, width: bounds.width, height: bounds.height)
        gl.startPoint = startPoint
        
        let r: CGFloat
        if let radius = radius {
            r = toCGFloat(value: radius, width: bounds.width, height: bounds.height, fm: bounds.width)
        } else {
            r = min(bounds.width, bounds.height) / 2.0
        }

        gl.endPoint = CGPoint(x: startPoint.x + r / bounds.width, y: startPoint.y + r / bounds.height)
    }
}
