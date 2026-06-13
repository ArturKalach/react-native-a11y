# CLAUDE.md — Android

This file provides guidance to Claude Code (claude.ai/code) when working with the Android native code in this directory. See the repo-root [CLAUDE.md](../CLAUDE.md) for JS/build/architecture context.

## Layout

All Java lives under the `com.reactnativea11y` package. There is no Kotlin despite the `A11y_kotlinVersion` property.

- `src/main/java/com/reactnativea11y/` — the real implementation, identical across architectures.
- `src/newarch/` and `src/oldarch/` — **arch-specific spec shims**, selected in [build.gradle](build.gradle) via `isNewArchitectureEnabled()`. Only one set is on the source path per build.
- `generated/java` + `generated/jni` — Codegen output, added to the source path only on the new arch.
- `src/main/AndroidManifest.xml` vs `AndroidManifestNew.xml` — the latter (without `package=`) is used when the AGP version supports `namespace` (≥ 7.3); the former is the fallback.

## The new/old arch split

This is the single most important thing to get right when editing native code.

- **Module specs**: `src/newarch/RCA11yModuleSpec.java` extends the Codegen-generated `NativeA11yModuleSpec` (an abstract TurboModule base). `src/oldarch/RCA11yModuleSpec.java` hand-declares the same abstract methods on top of `ReactContextBaseJavaModule`. [RCA11yModule.java](src/main/java/com/reactnativea11y/RCA11yModule.java) extends whichever `RCA11yModuleSpec` is on the path, so **its method signatures must match both shims**. When you add/change a native method, edit the JS TurboModule spec, the `oldarch` shim, and the `RCA11yModule` implementation together — the `newarch` shim is generated, so it tracks the JS spec automatically.
- The same pattern applies to `RCA11yFocusWrapperManagerSpec` and `RCA11yTextInputWrapperManagerSpec`.
- `BuildConfig.IS_NEW_ARCHITECTURE_ENABLED` is the runtime flag (used in `A11yPackage` to mark `isTurboModule`).

> View managers (`RCA11yFocusWrapperManager`, `RCA11yTextInputWrapperManager`) are registered the **classic** way via `createViewManagers` in `A11yPackage` and run on both architectures — they are not Fabric-only. New-arch interop handles them.

## Module wiring

- [A11yPackage.java](src/main/java/com/reactnativea11y/A11yPackage.java) is a `TurboReactPackage`: `getModule` returns `RCA11yModule`, `getReactModuleInfoProvider` advertises it, `createViewManagers` registers the two view managers. This is the entry point consumers register.
- [RCA11yModule.java](src/main/java/com/reactnativea11y/RCA11yModule.java) is a thin `@ReactMethod` surface that delegates to [RCA11yModuleImpl.java](src/main/java/com/reactnativea11y/RCA11yModuleImpl.java). Several methods are deliberate **stubs** (`isA11yReaderEnabled` always resolves `true`; `announceForAccessibility`, `setAccessibilityFocus`, `setPreferredKeyboardFocus` are no-ops) because the JS Android impl routes those through RN's own `AccessibilityInfo` instead. Don't "fix" these without checking [../src/modules/A11yModule/A11yModule.android.ts](../src/modules/A11yModule/A11yModule.android.ts).
- `RCA11yModuleImpl` owns the two services and bridges keyboard-status events to JS via `RCTDeviceEventEmitter` under the event name `keyboardStatus` (`KEYBOARD_STATUS_EVENT`), payload `{ status: boolean }`.

## Services (`services/`)

- **A11yReader** — screen-reader concerns. `announceScreenChange` sends a `TYPE_WINDOW_STATE_CHANGED` AccessibilityEvent; `setA11yOrder` chains views with `setAccessibilityTraversalBefore` / `setNextFocusForwardId` (API 24+, runs on the UI thread, needs ≥ 2 tags).
- **KeyboardService** — physical-keyboard detection. Reads `Configuration.keyboard` for connection state and registers a `ACTION_CONFIGURATION_CHANGED` `BroadcastReceiver` (tied to host lifecycle via `LifecycleEventListener`) to emit changes. `setKeyboardFocus` resolves a view and calls `requestFocus()`.
- **KeyboardKeyPressHandler** — translates raw `KeyEvent`s into press-down/press-up/long-press intents, deduping repeated key-down via internal maps. Used by `RCA11yFocusWrapperManager`.

## Resolving React tags → Views

Always go through `RCA11yUIManagerHelper.resolveView(tag)`. It branches on `ViewUtil.getUIManagerType(tag)`: `FABRIC` tags resolve via `UIManagerHelper.getUIManager`, others via the legacy `UIManagerModule`. This is why services depend on it rather than calling a UI manager directly — it keeps tag resolution arch-agnostic. View operations must run on the UI thread (`activity.runOnUiThread`).

## Custom events (`events/`)

`FocusChangeEvent` (`onFocusChange`), `KeyPressDownEvent` (`onKeyDownPress`), `KeyPressUpEvent` (`onKeyUpPress`) extend `Event<>` and are dispatched through `UIManagerHelper.getEventDispatcherForReactTag`. The manager exposes their JS prop names in `getExportedCustomDirectEventTypeConstants`. Adding a new event means: create the `Event` subclass, dispatch it, and register its `registrationName` in the manager.

## Build config

`gradle.properties` holds the defaults (`A11y_*`: minSdk 21, compile/target 31, ndk 21.4.x), each overridable by a root-project `ext` property of the same un-prefixed name. Java source/target is 1.8. Codegen library name is `A11y` with package `com.reactnativea11y` (set in `build.gradle` `react {}` and root `codegenConfig`). There is no standalone Gradle task here — the library is built as part of the example app or via the root `turbo build:android`.
