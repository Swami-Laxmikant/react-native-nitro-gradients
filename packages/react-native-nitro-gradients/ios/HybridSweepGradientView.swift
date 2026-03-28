import Foundation
import UIKit
import NitroModules

class ConicGradientLayerView: UIView, GradientLayerProvider {
    var onLayout: (() -> Void)?

    override class var layerClass: AnyClass { CAGradientLayer.self }
    var gradientLayer: CAGradientLayer { layer as! CAGradientLayer }

    override init(frame: CGRect) {
        super.init(frame: frame)
        gradientLayer.type = .conic
        gradientLayer.contentsScale = UIScreen.main.scale // TODO: see default values
        gradientLayer.isOpaque = false
    }

    required init?(coder: NSCoder) { fatalError() }

    override func layoutSubviews() {
        super.layoutSubviews()
        onLayout?()
    }

    override func didMoveToWindow() {
        super.didMoveToWindow() // TODO: check if need to call this way
    }
}

class HybridSweepGradientView: HybridSweepGradientViewSpec {

    private let containerView = UIView()
    private let gradientView = ConicGradientLayerView(frame: .zero)
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
                cachedLocations = positions?.map { NSNumber(value: $0) }
            }
        }
    }

    var center: Vector? = nil {
        didSet {
            if !vectorsEqual(oldValue, center) {
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

        isDirty = true
        DispatchQueue.main.async { [weak self] in
            self?.updateGradient()
        }
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
                updateGradientFrame()
            }
        }
    }

    func update(colors: [Double], positions: [Double]?, center: Vector?, blur: Double?, tileMode: String?) throws {
        self.colors = colors
        self.positions = positions
        self.center = center
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
        applyGeometry()
        CATransaction.commit()

        applyBlur()
        isDirty = false
    }

    private func ensureBlurView() {
        guard blurImageView.superview == nil else { return }
        blurImageView.translatesAutoresizingMaskIntoConstraints = false
        containerView.addSubview(blurImageView)
        NSLayoutConstraint.activate([
            blurImageView.topAnchor.constraint(equalTo: containerView.topAnchor),
            blurImageView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            blurImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            blurImageView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
        ])
    }

    private func removeBlurView() {
        guard blurImageView.superview != nil else { return }
        blurImageView.image = nil
        blurImageView.removeFromSuperview()
        gradientView.layer.opacity = 1
    }

    private func applyGeometry() {
        let bounds = gradientView.bounds
        guard bounds.width > 0 && bounds.height > 0 else { return }

        let gl = gradientView.gradientLayer
        let centerValue = center ?? Vector(x: .first("50%"), y: .first("50%"))
        let normalizedCenter = toNormalizedPoint(value: centerValue, width: bounds.width, height: bounds.height)
        gl.startPoint = normalizedCenter
        gl.endPoint = CGPoint(x: normalizedCenter.x, y: normalizedCenter.y - 0.1) // CSS like start from top
    }

    private func applyBlur() {
        manageBlur(gradientView: gradientView, blur: blur, blurImageView: blurImageView, tileMode: tileMode, containerView: containerView)
    }

    private func updateGradientFrame() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        applyGeometry()
        CATransaction.commit()

        applyBlur()
    }
}
