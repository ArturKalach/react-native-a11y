# CLAUDE.md — Android

Guidance for the Android native code. See the package-root [CLAUDE.md](../CLAUDE.md)
for the public API and source layout.

> A single `com.reactnativea11y` package covering both screen-reader and physical-keyboard
> behavior; codegen output lives under `android/build/generated/`. (The pre-merge `0.7.0`
> `RCA11yModule`/`RCA11yFocusWrapper` design is preserved in git tag `legacy-0.7` for reference only.)

## Layout (`src/main/java/com/reactnativea11y/`)

- `utils/` — `A11yHelper`, `FocusHelper`, `ChoreographerUtils`, `FragmentUtils`, `ReactNativeVersionChecker`
- `events/` — merged `EventHelper` + all event classes (SR + keyboard/key): `FocusChangeEvent`,
  `KeyPressDownEvent`/`KeyPressUpEvent`, `MultiplyTextSubmit`, `ScreenReaderFocusedEvent`,
  `ScreenReaderFocusChangedEvent`, `ScreenReaderDescendantFocusChangedEvent`
- `linking/` — **unified order engine**: `A11yOrderLinking` + `A11yLinkingQueue`
  (sets `nextFocusForward` **and** `accessibilityTraversalBefore`) + `WeakTreeMap` +
  `FocusLinkObserver`(+`Singleton`) for `orderId` directional links
- `core/` — the **linearized base hierarchy**: EK keyboard chain
  (`ViewGroupBase → ViewOrderGroupBase → FocusHighlightBase → FocusableBase →
  ViewFocusChangeBase → ViewFocusRequestBase → ViewKeyHandlerBase`) with the SR layer
  `A11yScreenReaderView` re-parented onto its top
- `services/` — focus (`focus/A11yFocusService`/`A11yFocusDelegate`/`A11yFocusProtocol`),
  order (`order/A11yOrderService`), keyboard (`KeyboardFocusService`, `FocusMemoryService`,
  `KeyboardService`, `KeyboardKeyPressHandler`); `delegates/FocusOrderDelegate`(+Host)
- `modules/` — `A11yAnnounceModule` (**Android stub** — announcements go through RN
  `AccessibilityInfo` in JS; the native methods resolve no-op), `A11yKeyboardModule`
  (`dismissKeyboard`, `setKeyboardFocus`, `setPreferredKeyboardFocus`),
  `A11yKeyboardConnectedModule` (physical-keyboard connect/disconnect status + events),
  `A11yOrderModule` (`setA11yOrder` — imperative `Legacy.*` order)
- `views/` — `A11yView` (**merged**: keyboard `dispatchKeyEvent` ⊕ SR order/focus),
  `A11yLockView` (**merged** trap/frame, + `A11yLockService`), `A11yOrderView`, `A11yCardView`,
  `A11yPaneTitle`, `A11yFocusGroup`, `A11yTextInputWrapper` — each with its manager
- root: the 7 `*ManagerSpec` view-manager bases + the merged `A11yPackage`

## `A11yPackage` (root)

A single `TurboReactPackage`. `createViewManagers` registers all 7 managers
(`A11yView`, `A11yLock`, `A11yOrder`, `A11yCard`, `A11yPaneTitle`, `A11yFocusGroup`,
`A11yTextInputWrapper`). `getModule` + `getReactModuleInfoProvider` register the 4 modules
keyed by their native `NAME` (`RCA11y{Announce,Keyboard,KeyboardConnected,Order}Module`),
with `isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED`.

## Arch split (new/old) — only modules need it

- **View managers**: their `*ManagerSpec` bases live in `src/main/` and just
  `extend ReactViewManager` with abstract `@ReactProp` setters. They do **not**
  implement a codegen `ViewManagerWithGeneratedInterface`, so `getDelegate()` keeps
  its default **reflection** path and props are set the same way on both arches.
  No newarch/oldarch duplication for views.
- **Modules**: `src/newarch/A11y{Announce,Keyboard,KeyboardConnected,Order}ModuleSpec`
  extend the codegen `NativeRCA11y*Spec`; `src/oldarch/…` extend `ReactContextBaseJavaModule`
  with abstract methods. The module impls in `modules/` extend whichever spec is on the path.

## Unified order engine — the key merge

`A11yLinkingQueue` (index-based) always wires `setNextFocusForwardId` (keyboard) and
also `setAccessibilityTraversalBefore` (screen reader). SR registers by `orderKey`,
keyboard by `orderGroup` — independent keys in one `A11yOrderLinking`, so the shared
`orderIndex` feeds both and each activates only when its key/group is present.
Keyboard directional order (`orderId`/`orderLeft…`) uses `FocusLinkObserver`. The
merged `A11yView` holds `orderType` (`auto|keyboard|screen-reader`).

## Events

All events extend `Event<>` and dispatch via `UIManagerHelper.getEventDispatcherForReactTag`
(works on both arches). Managers expose JS names via `getExportedCustomDirectEventTypeConstants`.

## Build

`gradle.properties` `A11y_*` defaults: `minSdk 21`, `compile`/`target 31`, `kotlin 1.7.0`,
`ndk 21.4.7075529`. `build.gradle` `react { libraryName = "A11y"; codegenJavaPackageName =
"com.reactnativea11y" }`, `namespace "com.reactnativea11y"`. Built via the example app.
