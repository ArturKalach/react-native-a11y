# CLAUDE.md — iOS

Guidance for the iOS native code. See the package-root [CLAUDE.md](../CLAUDE.md)
for the public API and source layout.

> One Obj-C++ tree under the `RCA11y*` prefix, covering both screen-reader and physical-keyboard
> behavior. (The pre-merge `0.7.0` `RCA11yFocusWrapper` design is preserved in git tag
> `legacy-0.7` for reference only.)

## Podspec / build

`react-native-a11y.podspec`: `source_files = "ios/**/*.{h,m,mm,cpp}"`, links the
`GameController` framework (physical-keyboard input), and calls
`install_modules_dependencies(s)` so it builds on both old and new arch. Codegen private
headers are generated under `ios/generated/`. Almost everything is Obj-C++ (`.mm`).

## Layout (`ios/`)

- `views/RCA11y*View/` — the 7 Fabric components, each with a `*View` + `*ViewManager`:
  `RCA11yView` (the merged core), `RCA11yLockView` (merged trap/frame), `RCA11yOrderView`,
  `RCA11yCardView`, `RCA11yPaneTitleView`, `RCA11yFocusGroup`, `RCA11yTextInputWrapper`.
- `views/base/` — the linearized base hierarchy for `RCA11yView` (see below).
- `modules/` — the 4 TurboModules + `RCA11yViewResolver.h` (cross-arch tag→UIView resolver).
- `services/` — announce queue, focus services, order linking, focus-link observer, etc.
- `delegates/`, `protocols/`, `helpers/`, `extensions/` — supporting plumbing (see below).

## `RCA11yView` — the merged core view

One native view backs `A11y.View` / `A11y.Index` / `A11y.Pressable` / `A11y.Input`. It unites
a11y-order's screen-reader index view and external-keyboard's focusable view through a single
**linearized base chain** (each layer opt-in via its props):

```
RCA11yBaseViewClass        // = RCTViewComponentView (newarch) / RCTView (oldarch)
  → RCA11yViewGroupBase
  → RCA11yViewOrderGroupBase
  → RCA11yKeyboardHaloBase          ┐
  → RCA11yViewGroupIdentifierBase   │ keyboard chain
  → RCA11yViewFocusChangeBase       │ (focus, halo, key events,
  → RCA11yViewContextMenuBase       │  context menu, order group)
  → RCA11yViewFocusRequestBase      │
  → RCA11yViewKeyPress              ┘
  → RCA11ySRViewGroup               ┐
  → RCA11ySRView                    │ screen-reader chain
  → RCA11ySRGroupChildrenView       │ (SR order, focus, grouping,
  → RCA11ySRManagedFocusView        │  managed focus, container)
  → RCA11ySRViewOrder               ┘
  → RCA11yOptimisticBase            // optimistic a11y props (iOS-only)
  → RCA11yView                      // leaf: focusableWrapper + old-arch event blocks
```

`RCA11yTextInputWrapper` reuses the keyboard chain (subclasses `RCA11yViewFocusChangeBase`).
The other views (`RCA11yLockView`, `RCA11yOrderView`, `RCA11yCardView`,
`RCA11yPaneTitleView`, `RCA11yFocusGroup`) subclass `RCTViewComponentView`/`RCTView` directly.

## Modules (`ios/modules/`, registered via codegen `modulesProvider`)

- `RCA11yAnnounceModule` — `announce`/`cancel`/`cancelAll`; backed by
  `services/RCA11yAnnounceService/` (queue + navigation-aware debounced post via `UIAccessibility`).
- `RCA11yKeyboardModule` — `dismissKeyboard`, `setKeyboardFocus`, `setPreferredKeyboardFocus`.
- `RCA11yKeyboardConnectedModule` — physical-keyboard connect/disconnect status + events
  (uses `GameController`).
- `RCA11yOrderModule` — `setA11yOrder` (imperative `Legacy.*` order).

`RCA11yViewResolver.h` chains `RCTViewRegistry` → `surfacePresenter` so the imperative modules
resolve a React tag to a `UIView` across Paper, bridgeless new arch, and bridgeful new arch.

## Supporting code

- **`services/`** — `RCA11yAnnounceService`, `RCA11yFocusService`, `RCA11yKeyboardFocusService`,
  `RCA11yFocusMemoryService`, `RCA11yOrderLinking` + `RCA11yKbdOrderLinking` (SR + keyboard
  order), `RCA11yFocusLinkObserver` (+`RCA11yOrderSubscriber`) for directional `orderId` links,
  `RCA11yRelationship`, `RCA11ySortedMap`, `RCA11yItemDelegate`.
- **`delegates/`** — focus, focus-link, focus-sequence, group-identifier, halo, and
  view-item delegates (each `RCA11y*Delegate`).
- **`protocols/`** — capability protocols (`RCA11yFocusProtocol`, `RCA11yFocusOrderProtocol`,
  `RCA11yKeyboardFocusableProtocol`, `RCA11yHaloProtocol`, `RCA11yGroupIdentifierProtocol`,
  `RCA11yOptimisticProtocol`, etc.).
- **`helpers/`** — `RCA11yFabricEventHelper` (event dispatch), `RCA11yKeyboardKeyPressHandler`,
  `RCA11yFocusEffectUtility`, `RCA11yFocusGuideHelper`, `RCA11yPropsHelper`,
  `RCA11ySpeechAttributes`, `RCA11yDebouncer`, `RCA11ySwizzleInstanceMethod`,
  `RCA11yFocusChangeListener`.
- **`extensions/`** — categories adding a11y behavior to RN/UIKit views: `RCTViewComponentView`,
  `RCTCustomScrollView`/`RCTEnhancedScrollView`, `RCTModalHostViewComponentView`,
  `RCTTextInputComponentView`, `UIView`, `UIViewController`.

## Arch split

Mostly transparent: views derive from `RCTViewComponentView` (new) or `RCTView` (old) via the
`RCA11yBaseViewClass` typedef, and the leaf `RCA11yView` only declares old-arch
`RCTDirectEventBlock`/`RCTBubblingEventBlock` properties under `#ifndef RCT_NEW_ARCH_ENABLED`
(new arch gets these from codegen). Keep any spec change mirrored against Android.
