import Foundation
import UIKit
import NitroModules

class AxialGradientLayerView: UIView, GradientLayerProvider {
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

class HybridLinearGradientView: HybridLinearGradientViewSpec {

    private let containerView = UIView()
    private let gradientView = AxialGradientLayerView(frame: .zero)
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

    var start: Vector? = nil {
        didSet {
            if angle != nil { return }
            if !vectorsEqual(oldValue, start) {
                isDirty = true
            }
        }
    }

    var end: Vector? = nil {
        didSet {
            if angle != nil { return }
            if !vectorsEqual(oldValue, end) {
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

    // MARK: - Initialization

    override init() {
        self.view = containerView
        super.init()

        gradientView.translatesAutoresizingMaskIntoConstraints = false
//        blurImageView.translatesAutoresizingMaskIntoConstraints = false

        containerView.addSubview(gradientView)
//        containerView.addSubview(blurImageView)
//        blurImageView.isHidden = true

        NSLayoutConstraint.activate([
            gradientView.topAnchor.constraint(equalTo: containerView.topAnchor),
            gradientView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
            gradientView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
            gradientView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
//            blurImageView.topAnchor.constraint(equalTo: containerView.topAnchor),
//            blurImageView.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
//            blurImageView.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
//            blurImageView.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
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
        updateGradient()
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
            } else if isLayoutValid {
                isDirty = true
                applyGeometry()
            }
        }
    }

    func update(colors: [Double], positions: [Double]?, start: Vector?, end: Vector?, angle: Double?, blur: Double?, tileMode: String?) throws {
        
        self.colors = colors
        self.positions = positions
        self.start = start
        self.end = end
        self.angle = angle
        self.blur = blur
        self.tileMode = tileMode
        
        updateGradient()
    }

    private func updateGradient() {
        guard isDirty else { return }

        if cachedColors.isEmpty {
            cachedColors = colors.map { parseColorInt($0).cgColor } // TODO: see if redundant
        }

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
    
    private func applyBlur(){
        manageBlur(gradientView: gradientView, blur: blur, blurImageView: blurImageView, tileMode: tileMode, containerView: containerView)
    }

    private func applyGeometry() {
        let bounds = gradientView.bounds
        guard bounds.width > 0 && bounds.height > 0 else { return }

        let gl = gradientView.gradientLayer

        let startValue = start ?? Vector(x: .first("50%"), y: .first("0%"))
        let endValue = end ?? Vector(x: .first("50%"), y: .first("100%"))

        gl.startPoint = toNormalizedPoint(value: startValue, width: bounds.width, height: bounds.height)
        gl.endPoint = toNormalizedPoint(value: endValue, width: bounds.width, height: bounds.height)

        gradientView.gradientLayer.setNeedsDisplay()
    }

    private func setPointsFromAngle(angle: Double, width: CGFloat, height: CGFloat) {
        if width == 0 || height == 0 { return }

        let adjustedAngle = CGFloat(angle) - 90
        let cx = width / 2
        let cy = height / 2
        let relativeStartPoint = getGradientStartPoint(angle: adjustedAngle, hWidth: cx, hHeight: cy)

        let absoluteStartX = cx + relativeStartPoint.0
        let absoluteStartY = cy + relativeStartPoint.1
        let absoluteEndX = cx - relativeStartPoint.0
        let absoluteEndY = cy - relativeStartPoint.1

        start = Vector(x: .second(Double(absoluteStartX)), y: .second(Double(absoluteStartY)))
        end = Vector(x: .second(Double(absoluteEndX)), y: .second(Double(absoluteEndY)))
    }
}
