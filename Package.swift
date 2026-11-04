// swift-tools-version: 6.0

import Foundation
import PackageDescription

let usedRootEntries: Set<String> = ["ios", "spm-headers", "Package.swift"]
let unusedRootEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory)
    .filter { !usedRootEntries.contains($0) }
    .sorted()
let optionalIOSExcludes = [
    "ios/CLAUDE.md",
    "ios/features/Halo/CLAUDE.md",
].filter { FileManager.default.fileExists(atPath: Context.packageDirectory + "/" + $0) }

let iosDirectory = Context.packageDirectory + "/ios"
let headerSearchPaths = Set(
    FileManager.default.enumerator(atPath: iosDirectory)!.allObjects
        .compactMap { entry -> String? in
            guard let path = entry as? String, path.hasSuffix(".h") else { return nil }
            return "ios/" + (path as NSString).deletingLastPathComponent
        }
).sorted()

let package = Package(
    name: "RNA11y",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNA11y", targets: ["RNA11y"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNA11y",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: ".",
            exclude: optionalIOSExcludes + unusedRootEntries,
            sources: ["ios"],
            // SwiftPM requires an existing public headers folder; this one exports no headers.
            publicHeadersPath: "spm-headers/public",
            cSettings: headerSearchPaths.map { .headerSearchPath($0) } + [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            cxxSettings: headerSearchPaths.map { .headerSearchPath($0) } + [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [
                .linkedFramework("UIKit"),
                .linkedFramework("Foundation"),
                .linkedFramework("CoreGraphics"),
                .linkedFramework("GameController"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
