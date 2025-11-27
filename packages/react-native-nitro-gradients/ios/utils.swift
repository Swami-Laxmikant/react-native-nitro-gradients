import UIKit
import NitroModules

func toCGFloat(value: Variant_String_Double, width: CGFloat, height: CGFloat, fm: CGFloat) -> CGFloat {
    switch value {
    case .first(let s):
        if s.hasSuffix("w%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01) * width
        } else if s.hasSuffix("h%"), let num = Double(s.dropLast(2)) {
            return CGFloat(num * 0.01) * height
        } else if s.hasSuffix("%"), let num = Double(s.dropLast(1)) {
            return CGFloat(num * 0.01) * fm
        }
        return CGFloat(0)
    case .second(let v):
        return CGFloat(v)
    }
}

func toCGPoint(value: VectorR, width: CGFloat, height: CGFloat) -> CGPoint {
    return CGPoint(
        x: toCGFloat(value: value.x, width: width, height: height, fm: width),
        y: toCGFloat(value: value.y, width: width, height: height, fm: height)
    )
}

func parseColorInt(_ color: Double) -> UIColor {
    let rgba = UInt64(color)
    let a = CGFloat((rgba & 0xFF000000) >> 24) / 255.0
    let r = CGFloat((rgba & 0x00FF0000) >> 16) / 255.0
    let g = CGFloat((rgba & 0x0000FF00) >> 8) / 255.0
    let b = CGFloat(rgba & 0x000000FF) / 255.0
    return UIColor(red: r, green: g, blue: b, alpha: a)
}

class CustomGradientView: UIView {
    private let onBoundsChange: () -> Void
    private var lastBounds: CGRect = .zero
    
    init(onBoundsChange: @escaping () -> Void) {
        self.onBoundsChange = onBoundsChange
        super.init(frame: .zero)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        if bounds != lastBounds {
            lastBounds = bounds
            onBoundsChange()
        }
    }
}

