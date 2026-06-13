# CLAUDE.md — iOS

This file provides guidance to Claude Code (claude.ai/code) when working with the iOS native code in this directory. See the repo-root [CLAUDE.md](../CLAUDE.md) for JS/build/architecture context.

All sources are Objective-C++ (`.mm`) / Objective-C headers; there is no Swift. The Pod is defined by [../react-native-a11y.podspec](../react-native-a11y.podspec), which globs `ios/**/*.{h,m,mm,cpp}` and runs `install_modules_dependencies` (so it builds on both architectures). There is no project file here — the code compiles inside the example app's Pods or a consumer app after `pod install`.

## The new/old arch split (`#ifdef RCT_NEW_ARCH_ENABLED`)

This is the dominant pattern across the iOS code; almost every component file is two implementations guarded by `RCT_NEW_ARCH_ENABLED`.

- **TurboModule**: [Modules/RCA11yModule/RCA11yModule.mm](Modules/RCA11yModule/RCA11yModule.mm) is an `RCTEventEmitter`/`RCTBridgeModule` whose `RCT_EXPORT_METHOD`s work on both arches. On the new arch it additionally provides `getTurboModule:` returning a `NativeA11yModuleSpecJSI` (from the Codegen-generated `RNA11ySpec`).
- **Fabric components** (e.g. `RCA11yFocusWrapper`): on the new arch the view subclasses `RCTViewComponentView`, declares a `componentDescriptorProvider`, handles props via `updateProps:oldProps:`, fires events through the C++ `…EventEmitter`, and exports a `…Cls()` plugin function. On the old arch the *same class* subclasses `RCTView`, uses `RCTDirectEventBlock` properties, and is driven by a paired `…Manager` (`RCTViewManager`) using `RCT_EXPORT_VIEW_PROPERTY` / `RCT_CUSTOM_VIEW_PROPERTY`.
- The `…Manager.mm` files (`RCA11yFocusWrapperManager`, `RCA11yTextInputWrapperManager`, `RCA11yPaneViewManager`) matter mainly on the **old arch**; on the new arch the Codegen `componentProvider` map in [../package.json](../package.json) (`RCA11yFocusWrapper`, `RCA11yPaneView`, `RCA11yTextInputWrapper`) wires views directly.

When changing a component prop or event, update **both** branches of its header and `.mm`, the manager's `RCT_EXPORT_…` declarations (old arch), and the JS `*NativeComponent.ts` spec (which regenerates the new-arch glue). Mismatch between the two branches is the most common iOS bug here.

> `RCA11yPaneView` only exists as a real class under `RCT_NEW_ARCH_ENABLED`; on the old arch `RCA11yPaneViewManager` just returns a plain `UIView`. It maps to UIKit accessibility "pane" semantics.

## RCA11yModule responsibilities

[RCA11yModule.mm](Modules/RCA11yModule/RCA11yModule.mm) is the imperative bridge surface. Key behaviors:

- **Keyboard connection** uses the **GameController** framework, loaded defensively via `NSClassFromString(@"GCKeyboard")` (iOS 14+). If the framework isn't linked, `isKeyboardConnected` rejects with `GC_FRAMEWORK_LINKING_ERROR` — the JS iOS impl special-cases that code. Connect/disconnect are observed through `GCKeyboardDidConnect/DisconnectNotification` and re-emitted as the `keyboardStatus` event (`status` payload), gated by `hasListeners`.
- `announceForAccessibility` / `announceScreenChange` / `setAccessibilityFocus` post `UIAccessibility…Notification`s.
- `setKeyboardFocus` is the non-trivial one: it sets `controller.customFocusView` on the view's `reactViewController` and forces a focus update (`setNeedsFocusUpdate` + `updateFocusIfNeeded`). This depends on the swizzle below.
- `setA11yOrder` sets `accessibilityElements` on the container view in the given order.
- All UI work is dispatched to the main queue; views are resolved via `self.bridge.uiManager viewForReactTag:`.

## Keyboard focus via swizzling (`Extensions/`)

UIKit only honors a view controller's `preferredFocusEnvironments`, so programmatic keyboard focus is achieved by method swizzling, not subclassing:

- [Extensions/RCA11ySwizzleInstanceMethod.mm](Extensions/RCA11ySwizzleInstanceMethod.mm) — a generic `class_addMethod`/`method_exchangeImplementations` helper, plus the `RCA11Y_INSTALL_SWIZZLES` macro that registers via `+load` normally, or a `__attribute__((constructor))` when `RCT_DYNAMIC_FRAMEWORKS` is set.
- [Extensions/UIViewController+RCA11y.mm](Extensions/UIViewController+RCA11y.mm) — adds an associated-object `customFocusView` property to `UIViewController` and swizzles `preferredFocusEnvironments` so that, when set, the custom view is inserted at index 0. `RCA11yModule setKeyboardFocus:` populates this property.

If keyboard focus stops working, suspect the swizzle install path or the `customFocusView` association first.

## Key-press handling

`KeyboardKeyPressHandler` ([Components/.../KeyboardKeyPressHandler/](Components/RCA11yFocusWrapperManager/RCA11yFocusWrapper/KeyboardKeyPressHandler/)) turns UIKit `UIPress`/`UIPressesEvent` (from `pressesBegan`/`pressesEnded` on `RCA11yFocusWrapper`) into the dictionary payloads carrying `keyCode`, modifier flags, and `isLongPress` that feed the `onKeyDownPress` / `onKeyUpPress` events. `RCA11yFocusWrapper` overrides `canBecomeFocused` (from `canBeFocused`) and `preferredFocusEnvironments` (from `myPreferredFocusedView`).

## Conventions

- Component folders nest: `…Manager/` contains the manager `.mm` plus the view subfolder (`RCA11yFocusWrapper/`), which may further nest helpers (`KeyboardKeyPressHandler/`).
- `min_ios_version_supported` (from the consuming RN project) gates the platform; runtime API gating uses `@available` / `NSClassFromString` rather than hard linkage, keeping GameController optional.
- Codegen private headers live under `ios/generated/**` (declared in the podspec); they are build artifacts, not committed source.
