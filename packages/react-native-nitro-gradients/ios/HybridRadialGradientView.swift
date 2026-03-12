import Foundation
import UIKit
import NitroModules

class HybridRadialGradientView: HybridRadialGradientViewSpec {

    // MARK: - Private Properties

    private let containerView = UIView()
    private let gradientView = RadialGradientLayerView(frame: .zero)
    private let blurImageView = UIImageView()
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

    var radius: Variant_String_Double? = nil {
        didSet {
            hasCustomRadius = radius != nil
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

    // MARK: - Lifecycle

    func afterUpdate() {
        updateGradient()
    }

    // MARK: - Initialization

    override init() {
        self.view = containerView
        super.init()

        gradientView.translatesAutoresizingMaskIntoConstraints = false
        blurImageView.translatesAutoresizingMaskIntoConstraints = false

        containerView.addSubview(gradientView)
        containerView.addSubview(blurImageView)
        blurImageView.isHidden = true

        NSLayoutConstraint.activate([
            gradientView.topAnchor.constraint(equalTo: containerView.topAnchor),
            gradientView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            gradientView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            gradientView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
            blurImageView.topAnchor.constraint(equalTo: containerView.topAnchor),
            blurImageView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            blurImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            blurImageView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
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
        cachedColors = colors.map { parseColorInt($0).cgColor }
        cachedLocations = computeLocations()
        updateGradient()
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
            } else if isLayoutValid {
                isDirty = true
                updateGradientFrame()
            }
        }
    }

    // MARK: - Update Interface

    func update(colors: Variant_NullType__Double_?, positions: [Double]?, center: Vector?, radius: Variant_String_Double?, blur: Double?, tileMode: String?) throws {
        var changed = false

        if let colorsVariant = colors, case .second(let colorsArray) = colorsVariant, !self.colors.elementsEqual(colorsArray) {
            self.colors = colorsArray
            changed = true
        }
        if !arraysEqual(self.positions, positions) {
            self.positions = positions
            changed = true
        }
        if !vectorsEqual(self.center, center) {
            self.center = center
            changed = true
        }
        if !variantsEqual(self.radius, radius) || self.hasCustomRadius != (radius != nil) {
            self.radius = radius
            changed = true
        }
        if self.blur != blur {
            self.blur = blur
            changed = true
        }
        if self.tileMode != tileMode {
            self.tileMode = tileMode
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

        let gl = gradientView.gradientLayer

        CATransaction.begin()
        CATransaction.setDisableActions(true)
        gl.colors = cachedColors
        gl.locations = cachedLocations
        CATransaction.commit()

        updateGradientFrame()
        isDirty = false
    }

    private func updateGradientFrame() {
        let bounds = gradientView.bounds
        guard bounds.width > 0 && bounds.height > 0 else { return }

        let gl = gradientView.gradientLayer

        CATransaction.begin()
        CATransaction.setDisableActions(true)

        let centerValue = center ?? Vector(x: .first("50%"), y: .first("50%"))
        gl.center = toCGPoint(value: centerValue, width: bounds.width, height: bounds.height)

        if hasCustomRadius, let radius = radius {
            let r = toCGFloat(value: radius, width: bounds.width, height: bounds.height, fm: bounds.width)
            gl.radius = CGSize(width: r, height: r)
        } else {
            let m = min(bounds.width, bounds.height) / 2.0
            gl.radius = CGSize(width: m, height: m)
        }

        CATransaction.commit()
        gl.setNeedsDisplay()

        updateBlurPresentation(
            sourceLayer: gl,
            sourceView: gradientView,
            imageView: blurImageView,
            radius: blur,
            tileMode: tileMode
        )
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}
