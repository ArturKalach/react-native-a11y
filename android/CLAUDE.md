# CLAUDE.md — Android

Guidance for the Android native code. See the repo-root [CLAUDE.md](../CLAUDE.md)
for the rework context and the workspace `REWORK_STEP_*.md` plan.

> **Rebuilt in rework Step 3** by merging react-native-a11y-order + react-native-external-keyboard
> into one `com.reactnativea11y` package. (The 0.7.0 `RCA11yModule`/`RCA11yFocusWrapper`
> design is gone — preserved in git tag `legacy-0.7`.) **Not yet compiled** — expect a
> compile-fix pass on the first `yarn example android`.

## Layout (`src/main/java/com/reactnativea11y/`)

- `utils/` — `A11yHelper`, `FocusHelper`, `ChoreographerUtils`, `FragmentUtils`, `ReactNativeVersionChecker`
- `events/` — merged `EventHelper` + all event classes (SR + keyboard/key)
- `linking/` — **unified order engine**: `A11yOrderLinking` + `A11yLinkingQueue`
  (sets `nextFocusForward` **and** `accessibilityTraversalBefore`) + `WeakTreeMap` +
  `FocusLinkObserver`(+`Singleton`) for `orderId` directional links
- `core/` — the **linearized base hierarchy**: EK keyboard chain
  (`ViewGroupBase → ViewOrderGroupBase → FocusHighlightBase → FocusableBase →
  ViewFocusChangeBase → ViewFocusRequestBase → ViewKeyHandlerBase`) with the SR layer
  `A11yScreenReaderView` re-parented onto its top (uses `getFirstChild()`)
- `services/` — focus (`A11yFocusService`/`Delegate`/`Protocol`), order
  (`A11yOrderService`), keyboard (`KeyboardFocusService`, `FocusMemoryService`,
  `KeyboardService`, `KeyboardKeyPressHandler`); `delegates/FocusOrderDelegate`(+Host)
- `modules/` — `A11yAnnounceModule` (Android stub; announcements go through RN
  `AccessibilityInfo` in JS) + `A11yKeyboardModule` (`dismissKeyboard`)
- `views/` — `A11yView` (**merged**: keyboard `dispatchKeyEvent` ⊕ SR order/focus),
  `A11yLockView` (**merged** trap/frame), `A11yOrderView`, `A11yCardView`,
  `A11yPaneTitle`, `A11yFocusGroup`, `A11yTextInputWrapper` — each with its manager
- root: the 7 `*ManagerSpec` view-manager bases + the merged `A11yPackage`

## Arch split (new/old) — only modules need it

- **View managers**: their `*ManagerSpec` bases live in `src/main/` and just
  `extend ReactViewManager` with abstract `@ReactProp` setters. They do **not**
  implement a codegen `ViewManagerWithGeneratedInterface`, so `getDelegate()` keeps
  its default **reflection** path and props are set the same way on both arches.
  No newarch/oldarch duplication for views.
- **Modules**: `src/newarch/A11y{Announce,Keyboard}ModuleSpec` extend the codegen
  `Native*Spec`; `src/oldarch/…` extend `ReactContextBaseJavaModule` with abstract
  methods. The module impls in `modules/` extend whichever is on the path.
- `BuildConfig.IS_NEW_ARCHITECTURE_ENABLED` flags `isTurboModule` in `A11yPackage`.

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

`gradle.properties` `A11y_*` defaults (minSdk 21, compile/target 31). Codegen
`libraryName = "A11y"`, package `com.reactnativea11y` (build.gradle `react {}` +
root `codegenConfig`). Built via the example app / `turbo build:android`.
