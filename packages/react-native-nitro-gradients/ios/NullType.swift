import Foundation

@objc(NullType)
public final class NullType: NSObject {
    @objc public static let `null` = NullType()

    private override init() {
        super.init()
    }
}

