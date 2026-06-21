# react-native-a11y — Documentation

Native-first React Native accessibility toolkit for **both** screen-reader order &
announcements (VoiceOver / TalkBack) **and** physical-keyboard focus — on iOS and
Android, for the New Architecture (Fabric / bridgeless) and the Legacy Bridge.

`react-native-a11y` re-merges [`react-native-a11y-order`](https://www.npmjs.com/package/react-native-a11y-order)
and [`react-native-external-keyboard`](https://www.npmjs.com/package/react-native-external-keyboard)
back into one self-contained package, under a single **`A11y.*`** namespace. Install
exactly one of the three packages — reach for `react-native-a11y` when you want both
capabilities at once.

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (hero-ios.gif) --> <img src="./images/hero-ios.gif" height="400" alt="react-native-a11y on iOS" /> | <!-- TODO: capture combined-package demo (hero-android.gif) --> <img src="./images/hero-android.gif" height="400" alt="react-native-a11y on Android" /> |

---

## Getting started

→ [Installation and quick start](./getting-started/getting-started.md)

Everything ships under one namespace. `A11y.View`, `A11y.Pressable`, and `A11y.Input`
are drop-in views that take **both** screen-reader and keyboard props; each capability
is opt-in and does work only when its props are present. `A11y.Order` / `A11y.Index`
control screen-reader traversal order, and `announce` / `ScreenReader` post
announcements.

---

## Guides

Task-focused walkthroughs. Read them in order, or jump to the one you need.

**Physical keyboard**

| # | Guide | Covers |
| :-- | :-- | :-- |
| 1 | [Pressable focus handling](./guides/pressable-focus.md) | Focus/blur events, `focusStyle`, `containerFocusStyle`, render props |
| 2 | [Native focus styling](./guides/focus-styling.md) | iOS halo (`haloEffect`, `tintColor`, `halo*`, `roundedHaloFix`) and Android highlight |
| 3 | [Programmatic focus](./guides/programmatic-focus.md) | `ref.focus()`, `keyboardFocus()`, `screenReaderFocus()`, `autoFocus` |
| 4 | [Keyboard text input](./guides/text-input.md) | `A11y.Input`, `focusType`, `blurType`, multiline submit |
| 5 | [Keyboard focus order](./guides/focus-order.md) | Link-based, index-based, and direction-lock keyboard ordering |

**Screen reader**

| Guide | Covers |
| :-- | :-- |
| [Screen-reader focus order](./guides/a11y-order.md) | Custom traversal sequences with `A11y.Order` + `A11y.Index` |
| [Cards with inner buttons](./guides/a11y-card.md) | `A11y.Card` — keep inner interactive elements accessible |
| [iOS semantic containers](./guides/a11y-ui-container.md) | `a11yUIContainer` (list, table, landmark, group) |
| [Screen-reader focus events](./guides/focus-events.md) | `onScreenReaderFocused` and descendant focus callbacks |
| [Focus lock](./guides/focus-lock.md) | `A11y.FocusTrap` / `A11y.FocusFrame` — confine focus in modals |
| [Announcements](./guides/announcements.md) | `announce` / `ScreenReader` + calm mode, `A11y.PaneTitle` / `A11y.ScreenChange` |

**New in the merge**

| Guide | Covers |
| :-- | :-- |
| [Optimistic accessibility values](./guides/optimistic-state.md) | `optimistic` prop — announce the predicted value on iOS, not the stale one |
| [Connection & runtime status](./guides/keyboard-connection-status.md) | `useIsKeyboardConnected` / `useIsScreenReaderEnabled` and their ref variants |

**Advanced**

| Guide | Covers |
| :-- | :-- |
| [Native focus services](./guides/native-focus-services.md) | Native-side `RCA11yKeyboardFocusService` / `RCA11yFocusMemoryService` for driving focus from your own native code |

---

## Components

Concise descriptions, when-to-use guidance, and full props tables for every component.

→ [Component overview](./components/overview.md)

| Component | Description |
| :-- | :-- |
| [`A11y.View`](./components/overview.md#a11yview) | Unified focusable `View` — screen-reader + keyboard props, all opt-in |
| [`A11y.Pressable`](./components/overview.md#a11ypressable) | Keyboard- and SR-focusable `Pressable` |
| [`A11y.Input`](./components/overview.md#a11yinput) | `TextInput` with keyboard focus support |
| [`A11y.Order` / `A11y.Index`](./components/overview.md#a11yorder--a11yindex) | Declarative screen-reader traversal order |
| [`A11y.Card`](./components/overview.md#a11ycard) | Card whose inner interactive elements stay accessible |
| [`A11y.FocusTrap` / `A11y.FocusFrame`](./components/overview.md#a11yfocustrap--a11yfocusframe) | Confine SR **and** keyboard focus to a region |
| [`A11y.PaneTitle` / `A11y.ScreenChange`](./components/overview.md#a11ypanetitle--a11yscreenchange) | Screen / panel transition announcements |
| [`A11y.FocusGroup`](./components/overview.md#a11yfocusgroup) | iOS `focusGroupIdentifier` grouping + shared `tintColor` |

---

## API reference

Non-component surface: announcements, the `Keyboard` module, the `withKeyboardFocus`
HOC, the imperative ref, hooks, status functions, and shared types.

→ [API overview](./api/overview.md)

| Item | Description |
| :-- | :-- |
| [`announce` / `ScreenReader`](./api/overview.md#announcements) | Reliable, navigation-aware announcements |
| [`Keyboard`](./api/overview.md#keyboard-module) | Soft-keyboard dismissal from a hardware keyboard |
| [`withKeyboardFocus`](./api/overview.md#withkeyboardfocus-hoc) | HOC that adds keyboard focus to any touchable |
| [`KeyboardFocus` (ref)](./api/overview.md#imperative-ref-keyboardfocus) | Imperative handle (`focus`, `keyboardFocus`, `screenReaderFocus`) |
| [Hooks](./api/overview.md#hooks) | `useIsKeyboardConnected`, `useIsScreenReaderEnabled`, `useIsViewFocused`, … |
| [Focus-order props](./api/overview.md#focus-order-props) | `orderId`, `order*`, `orderIndex`, `orderGroup`, `lockFocus` |
| [Types](./api/overview.md#types) | `KeyPress`, `FocusStyle`, `OrderType`, `A11yOptimisticConfig`, … |
| [`Legacy.*`](./api/legacy.md) | Imperative 0.7 focus-order shim (`useFocusOrder`, …) |

---

## Migration

→ [Migration guide](./migration/migration.md)

The combined package is the upgrade target for **three** existing setups; each has its
own section.

| Coming from | Highlights |
| :-- | :-- |
| [Legacy `react-native-a11y` 0.7](./migration/migration.md#from-legacy-react-native-a11y-07) | `A11yModule.*` / `A11yProvider` / `KeyboardFocusView` → `A11y.*`; imperative hooks move under `Legacy.*` |
| [`react-native-a11y-order`](./migration/migration.md#from-react-native-a11y-order) | Mostly a package swap — `A11y.*` names are unchanged; `orderType` values renamed |
| [`react-native-external-keyboard`](./migration/migration.md#from-react-native-external-keyboard) | `K.*` / `Focus.*` become deprecated aliases of `A11y.*`; prop & type renames |
