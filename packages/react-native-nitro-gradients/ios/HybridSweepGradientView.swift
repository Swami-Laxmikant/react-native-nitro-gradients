import Foundation
import UIKit
import NitroModules

class HybridSweepGradientView: HybridSweepGradientViewSpec {

    // MARK: - Private Properties

    private let containerView = UIView()
    private let gradientView = ConicGradientLayerView(frame: .zero)
    private let blurImageView = UIImageView()
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

    var center: Vector? = Vector(x: .first("50%"), y: .first("50%")) {
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

    func update(colors: Variant_NullType__Double_?, positions: [Double]?, center: Vector?, blur: Double?, tileMode: String?) throws {
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
        let normalizedCenter = toNormalizedPoint(value: centerValue, width: bounds.width, height: bounds.height)
        gl.startPoint = normalizedCenter
        gl.endPoint = CGPoint(x: normalizedCenter.x, y: 0.0)

        CATransaction.commit()

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
