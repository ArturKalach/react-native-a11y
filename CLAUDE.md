# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this package is

`react-native-a11y` (currently `0.8.0-alpha.2`) is a **self-contained React Native
accessibility library** covering two concerns under a single `A11y.*` namespace:

- **Screen-reader** (VoiceOver / TalkBack) focus **order**, focus traps/frames, pane &
  screen announcements, and an announcement queue.
- **Physical / external keyboard** focus, key-press events, focus links/order, focus
  locking, and focus styling.

It has **no runtime dependency** on any other package and ships independently.

### Design

- Single **`A11y.*` namespace**. The unified `A11y.View` / `A11y.Pressable` / `A11y.Input`
  each take both screen-reader and keyboard props, **opt-in**: with no a11y props they
  behave like a plain `View`, and each capability does work only when its props are present.
- A single `A11y.FocusTrap` / `A11y.FocusFrame` covers **both** SR + keyboard containment.
- One ordering engine selected by `orderType` (`auto | keyboard | screen-reader`);
  `screenReaderFocusTarget` controls the focus-target axis.
- A `Legacy.*` shim preserves the older imperative focus-order API.
- Native views are merged but modules stay scoped; native naming is unified on
  `RCA11y*` (iOS) / `com.reactnativea11y` (Android).
- Web is a best-effort View-mocked passthrough (`index.web.ts` re-exports the default entry).

> History: this library was assembled from two focused packages — `react-native-a11y-order`
> (SR) and `react-native-external-keyboard` (keyboard). The pre-merge `0.7.0` design
> (`A11yModule` / `RCA11yFocusWrapper`) is preserved in git tag `legacy-0.7` / branch
> `legacy/0.7.0` for reference only; it is not the base to extend.

## Toolchain

- **Yarn 4** (`yarn@4.11.0`) with workspaces; `example/` is the only workspace. Use `yarn`, never `npm`.
- **Node** pinned to `v22.20.0` (`.nvmrc`). RN 0.76.5 / React 18.3.1.

## Commands

- `yarn typecheck` — `tsc` (no emit)
- `yarn lint` — ESLint over `**/*.{js,ts,tsx}`
- `yarn test` — Jest (preset `react-native`); tests in `src/__tests__/` and `src/legacy/__tests__/`
- `yarn prepare` — build `lib/` via `react-native-builder-bob` (commonjs + module + typescript)
- `yarn clean` — remove `lib/` and native build dirs
- `yarn example start` / `yarn example android` / `yarn example ios` — example app (`cd example/ios && pod install` first for iOS)

**Pre-commit** (`lefthook.yml`): `eslint` on staged files, `tsc`, `commitlint`. Conventional Commits; releases via `release-it`.

## Public API (`src/index.tsx`)

Everything ships under the `A11y` namespace, plus top-level imperative APIs:

- **`A11y.*` components**: `View`, `Pressable`, `Input`, `Order`, `Index`, `Card`,
  `FocusTrap`, `FocusFrame`, `PaneTitle`, `ScreenChange`, `FocusGroup`, and
  `KeyboardFocusView` (sugar over `A11y.View` for the "focusable + `focusStyle`" case).
- **Imperative / modules**: `announce`, `cancel`, `cancelAll`, `ScreenReader`, `Keyboard`,
  `isKeyboardConnected`, `keyboardStatusListener`.
- **Hooks / utils**: `withKeyboardFocus`, `combineRefs`, `isScreenReaderEnabled` /
  `screenReaderStatusListener`, `useIsScreenReaderEnabled(Ref)`, `useIsKeyboardConnected(Ref)`.
- **Context**: `useIsViewFocused`, `useIsViewPressed`, `KeyboardOrderFocusGroup`,
  `useOrderFocusGroup`, `OrderFocusGroupContext`.
- **`A11yProvider`** — a backward-compat passthrough (status hooks live in `utils/`, no real provider needed).
- **`Legacy.*`** — the imperative focus-order shim: `useFocusOrder`,
  `useDynamicFocusOrder`, `useCombinedRef`, `A11yOrder`, `setAccessibilityFocus`,
  `setKeyboardFocus`, `setPreferredKeyboardFocus`. Source lives in `src/legacy/`.
- **Deprecated aliases** (back-compat): `KeyboardFocusTextInput`, `Focus.{Frame,Trap}`,
  `K.{Input,View,Pressable}`, and `react-native-external-keyboard` drop-in names
  (`BaseKeyboardView`, `ExternalKeyboardView`, `KeyboardExtendedBaseView`, `KeyboardFocusView`,
  `KeyboardExtendedView`, `KeyboardFocusGroup`, `KeyboardExtendedInput`,
  `KeyboardExtendedPressable`) — all map onto the unified components.

## Source structure (`src/`)

```
index.tsx / index.web.ts   // A11y namespace + top-level exports; web re-exports default entry
components/                // A11yView (the merged core view), A11yPressable, A11yInput,
                           //   A11yOrder, A11yIndex, A11yCard, A11yLock (FocusTrap + FocusFrame),
                           //   A11yPaneTitle (+ A11yScreenChange), A11yFocusGroup,
                           //   A11yKeyboardFocusView. Each is a folder with index + .types,
                           //   with .ios/.android/.web platform variants where they diverge.
modules/                   // A11yAnnounceModule (announce/cancel/ScreenReader; .android variant
                           //   routes through RN AccessibilityInfo), Keyboard, KeyboardConnected
nativeSpecs/               // codegen specs — the JS↔native contract (see below)
context/ hooks/ providers/ utils/ types/
legacy/                    // the Legacy.* imperative focus-order shim + its hooks/tests
```

### `A11y.View` — the core view
`components/A11yView/A11yView.tsx` unites the keyboard view (keyboard focus, key events, halo
styling, focus order/links) and the screen-reader index view (SR order/focus, container type,
descendant-focus events). It reads order context (`useOrderFocusGroup`, `useSequenceOrderKey`),
validates order props (`useOrderValidation`), and forwards everything to the single native
`A11yViewNative` (`RCA11yView`). It also backs `A11y.Index` (positional `index` / `A11y.Order`
membership wires the SR sequence key). Imperative ref commands: `keyboardFocus`,
`screenReaderFocus`, `focus`.

### `withKeyboardFocus` — the focus/press stores

`utils/withKeyboardFocus.tsx` is the HOC behind `A11y.Pressable`/`A11y.View`/`A11y.Input`. Two
per-instance stores (`utils/useValueStore.ts`, a minimal `useSyncExternalStore`-shaped boolean
store) let descendants react to focus/press **without** re-rendering the host:

- **Focus store** (`context/IsViewFocusedContext.tsx`, `useIsViewFocused`) — always updated on
  focus change; the host itself only re-renders when something it owns needs `focused`
  (`reactToFocus`, computed from `focusStyle`/`containerFocusStyle`/`renderContent`/
  `renderFocusable`/function `style`/function `containerStyle` — note `renderContent` **does**
  set `reactToFocus`, since it needs a live `focused` value merged into its render-prop state).
- **Press store** (`context/IsViewPressedContext.tsx`, `useIsViewPressed`) — updated
  unconditionally in `handlePressIn`/`handlePressOut` (the single choke point both touch *and*
  physical-keyboard activation flow through) and cleared on blur if a press was left stuck. This
  is the only press signal that's correct on touch + keyboard, both platforms, without depending
  on the Android heuristic below.

**Android keyboard-press gotcha:** physical keyboard activation never reaches RN `Pressable`'s
own touch responder, so anything reading `pressed` from *RN's own* render-prop state (function
`style`/`containerStyle`, `renderContent`, function `children`) needs `androidKeyboardPressState`
enabled to get keyboard parity with touch. `withKeyboardFocus` auto-enables it whenever
`style`/`containerStyle` is a function, or `renderContent`/function `children` is used
(`hasPressedRenderProp`) — if a future change adds another way to consume the wrapped
component's own `pressed`, it must be added to that auto-enable check too, or keyboard press will
silently stop styling/re-rendering on Android only (this exact bug shipped once already).

See [docs/guides/withKeyboardHandler.md](docs/guides/withKeyboardHandler.md) for the full
re-render-cost ranking of every declaration style.

## Codegen / native contract (`src/nativeSpecs/`)

`codegenConfig` in `package.json`: spec name `RNA11ySpec`, `type: all`, `jsSrcsDir: src`,
android `javaPackageName: com.reactnativea11y`. The spec files are the source of truth — any
change must be mirrored in **both** iOS and Android native code.

- **Fabric components** (`*NativeComponent.ts`): `RCA11yView`, `RCA11yLock`, `RCA11yOrder`,
  `RCA11yCard`, `RCA11yPaneTitle`, `RCA11yFocusGroup`, `RCA11yTextInputWrapper`.
- **TurboModules** (`Native*Module.ts`): `RCA11yAnnounceModule`, `RCA11yKeyboardModule`,
  `RCA11yKeyboardConnectedModule`, `RCA11yOrderModule`.

iOS impls live in `ios/` (Obj-C++, prefix `RCA11y*`); Android impls in
`android/src/main/java/com/reactnativea11y/`. See `ios/CLAUDE.md` and `android/CLAUDE.md`.
