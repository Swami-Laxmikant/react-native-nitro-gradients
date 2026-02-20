require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "NitroGradient"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported, :visionos => 1.0 }
  s.source       = { :git => "https://github.com/Swami-Laxmikant/react-native-nitro-gradients.git", :tag => "#{s.version}" }

  s.source_files = [
    # Implementation (Swift)
    "ios/**/*.{swift}",
    # Autolinking/Registration (Objective-C++)
    "ios/**/*.{m,mm}",
    # Implementation (C++ objects)
    "cpp/**/*.{hpp,cpp}",
  ]

  load 'nitrogen/generated/ios/NitroGradient+autolinking.rb'
  add_nitrogen_files(s)

  # Fix archive builds: without header_mappings_dir, CocoaPods uses the pod root
  # to map public headers, so the umbrella header gets stable paths instead of
  # broken relative paths like "../../ios/NitroGradient-Swift-Cxx-Bridge.hpp".
  # HEADER_SEARCH_PATHS ensures bare includes (e.g. #include "Vector.hpp") still resolve.
  s.pod_target_xcconfig = (s.attributes_hash['pod_target_xcconfig'] || {}).merge({
    "HEADER_SEARCH_PATHS" => [
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/shared/c++\"",
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/shared/c++/views\"",
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/ios\"",
      "\"$(PODS_TARGET_SRCROOT)/nitrogen/generated/ios/c++\"",
    ].join(" "),
  })

  s.dependency 'React-jsi'
  s.dependency 'React-callinvoker'
  install_modules_dependencies(s)
end
