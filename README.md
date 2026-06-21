![react-native-a11y](/.github/images/react-native-a11y.png)

# React Native A11y

<div>
  <img align="right" width="35%" src="/.github/images/react-native-a11y-example.gif" alt="Demo of a React Native app driven TalkBack focus order and a physical keyboard">
</div>

Native-first, **all-in-one** React Native accessibility toolkit — screen reader focus order &
announcements (VoiceOver / TalkBack), physical (external) keyboard support, keyboard-connection
status, and iOS accessibility containers, on iOS and Android. Everything ships under a single
**`A11y.*`** namespace.

It bundles the full feature set of four focused libraries into one self-contained package:

| Bundled library | What it brings |
| :-- | :-- |
| [`react-native-a11y-order`](https://www.npmjs.com/package/react-native-a11y-order) | Screen reader focus **order** control & announcements |
| [`react-native-external-keyboard`](https://www.npmjs.com/package/react-native-external-keyboard) | Using & implementing physical **keyboard** features |
| [`react-native-is-keyboard-connected`](https://www.npmjs.com/package/react-native-is-keyboard-connected) | Listening for hardware **keyboard connection** |
| [`react-native-a11y-container`](https://www.npmjs.com/package/react-native-a11y-container) | iOS `UIAccessibilityContainer` semantic grouping |

Plus a built-in **optimistic values** workaround — an alternative to
[`react-native-a11y-state-patch`](https://www.npmjs.com/package/react-native-a11y-state-patch) —
that announces the predicted accessibility value the moment the user acts, instead of the stale one.

- 🔢 **Screen reader focus order** — define the exact traversal sequence, independent of render order
- 🃏 **Cards with inner buttons** — card action and nested controls, both accessible at once
- 🔒 **Focus lock** — keep VoiceOver, TalkBack, *and* keyboard focus inside modals & overlays
- 📣 **Announcements** — reliable, navigation-aware messages and screen/panel transitions
- 🎯 **Keyboard focus management** — focus/blur events, `autoFocus`, imperative focus via `ref`
- ⌨️ **Key press events** — handle key-down / key-up with full modifier info
- 🎨 **Native focus styling** — iOS halo & `tintColor`, Android focus highlight
- 📦 **iOS accessibility containers** — `UIAccessibilityContainer` semantic grouping via `a11yUIContainer`
- 🔌 **Keyboard connection status** — listen for hardware keyboard connect/disconnect with `useIsKeyboardConnected`
- ✨ **Optimistic values** *(iOS)* — announce the predicted value the moment the user acts, not the stale one (a `react-native-a11y-state-patch` alternative)
- 📡 **Runtime status hooks** — `useIsKeyboardConnected`, `useIsScreenReaderEnabled`
- ⚡ New Architecture · Old Architecture · Bridgeless · Expo prebuild

> [!IMPORTANT]
> **This package re-merges the focused libraries into one.** `react-native-a11y` was
> originally split — for easier development and support — into
> [`react-native-a11y-order`](https://www.npmjs.com/package/react-native-a11y-order),
> [`react-native-external-keyboard`](https://www.npmjs.com/package/react-native-external-keyboard),
> [`react-native-is-keyboard-connected`](https://www.npmjs.com/package/react-native-is-keyboard-connected),
> and [`react-native-a11y-container`](https://www.npmjs.com/package/react-native-a11y-container).
> They are now mature, and this package recombines all of them — plus the optimistic-values
> workaround — under one unified `A11y.*` namespace. See [The rework](#the-rework) below.

> [!TIP]
> The focused packages stay published and are **mutually exclusive** — install exactly one.
> Use `react-native-a11y` for the **complete** toolkit; reach for a single focused package
> only if you need just that one capability.

</br>

## Installation

```sh
yarn add react-native-a11y
cd ios && pod install
```

Get started with the [getting started guide](./docs/getting-started/getting-started.md)
or jump straight to the [component overview](./docs/components/overview.md).

## Quick start

Everything is imported from the single `A11y` namespace, with imperative APIs, hooks, and
the keyboard-focus HOC at the top level.

**Keyboard focus** — `A11y.Pressable`, `A11y.View`, and `A11y.Input` are drop-in,
keyboard-focusable views:

```tsx
import { A11y } from 'react-native-a11y';
import { Text } from 'react-native';

<A11y.Pressable
  autoFocus
  onPress={onPress}
  focusStyle={{ backgroundColor: 'dodgerblue' }}
>
  <Text>Press me with Space or Enter</Text>
</A11y.Pressable>;
```

**Screen reader order & announcements** — `A11y.Order` + `A11y.Index` define the traversal
sequence; `announce` posts a message:

```tsx
import { A11y, announce } from 'react-native-a11y';

<A11y.Order>
  <A11y.Index index={1}><Text>Read first</Text></A11y.Index>
  <A11y.Index index={3}><Text>Read third</Text></A11y.Index>
  <A11y.Index index={2}><Text>Read second</Text></A11y.Index>
</A11y.Order>;

announce('Changes saved');
```

`A11y.View` is one component that accepts **both** prop sets — give it keyboard props,
screen-reader props, or both. To add keyboard focus to a component the namespace doesn't
cover, wrap it with the [`withKeyboardFocus`](./docs/components/overview.md#withkeyboardfocus) HOC.

> [!NOTE]
> On iOS, long-pressing the spacebar does not fire a long press — iOS routes it through
> *Full Keyboard Access*. Use `Tab + M` (the default "open context menu" command) instead,
> via `onContextMenuPress`.

## Architecture support

| Capability | Supported |
| :-- | :-- |
| New Architecture (Fabric / Turbo Modules) | ✅ |
| Old Architecture (Bridge) | ✅ |
| Bridgeless mode | ✅ |
| Expo (prebuild / bare) | ✅ |

## Documentation

New here? Start with the [getting started guide](./docs/getting-started/getting-started.md),
then follow a task-focused guide. The [full docs index](./docs/README.md) links everything.

**Guides — physical keyboard**

- [Pressable focus handling](./docs/guides/pressable-focus.md) — focus/blur events, `focusStyle`, render props
- [Native focus styling](./docs/guides/focus-styling.md) — iOS halo & `tintColor`, Android focus highlight
- [Programmatic focus](./docs/guides/programmatic-focus.md) — `ref.focus()`, `keyboardFocus()`, `autoFocus`
- [Keyboard text input](./docs/guides/text-input.md) — `A11y.Input`, `focusType`, `blurType`
- [Keyboard focus order](./docs/guides/focus-order.md) — link-based, index-based, direction locking

**Guides — screen reader**

- [Screen-reader focus order](./docs/guides/a11y-order.md) — `A11y.Order` + `A11y.Index`
- [Cards with inner buttons](./docs/guides/a11y-card.md) — `A11y.Card`
- [iOS semantic containers](./docs/guides/a11y-ui-container.md) — `a11yUIContainer`
- [Screen-reader focus events](./docs/guides/focus-events.md) — focus/blur callbacks
- [Focus lock](./docs/guides/focus-lock.md) — `A11y.FocusTrap` / `A11y.FocusFrame`
- [Announcements](./docs/guides/announcements.md) — `announce` / `ScreenReader`, `A11y.PaneTitle`

**Guides — new in the merge**

- [Optimistic accessibility values](./docs/guides/optimistic-state.md) — predicted-value announcements (iOS)
- [Connection & runtime status](./docs/guides/keyboard-connection-status.md) — `useIsKeyboardConnected`, `useIsScreenReaderEnabled`

**Reference**

- [Component overview](./docs/components/overview.md) — every component and its props
- [API reference](./docs/api/overview.md) — announcements, modules, hooks, the imperative ref, shared types
- [Legacy API](./docs/api/legacy.md) — the `Legacy.*` imperative 0.7 shim
- [Migration guide](./docs/migration/migration.md) — from 0.7, `-order`, or `-external-keyboard`

## What's available

**Components**

| Export | Purpose |
| :-- | :-- |
| [`A11y.View`](./docs/components/overview.md#a11yview) | Unified focusable `View` — screen-reader + keyboard props, all opt-in. |
| [`A11y.Pressable`](./docs/components/overview.md#a11ypressable) | Keyboard- and screen-reader-focusable `Pressable`. |
| [`A11y.Input`](./docs/components/overview.md#a11yinput) | `TextInput` with keyboard focus support. |
| [`A11y.Order` / `A11y.Index`](./docs/guides/a11y-order.md) | Declarative screen-reader traversal order. |
| [`A11y.Card`](./docs/guides/a11y-card.md) | Card that keeps inner interactive elements accessible. |
| [`A11y.FocusTrap` / `A11y.FocusFrame`](./docs/guides/focus-lock.md) | Confine screen-reader **and** keyboard focus to a region. |
| [`A11y.PaneTitle` / `A11y.ScreenChange`](./docs/guides/announcements.md) | Screen / panel transition announcements. |
| [`A11y.FocusGroup`](./docs/components/overview.md#a11yfocusgroup) | iOS `focusGroupIdentifier` grouping + shared `tintColor`. |
| [`withKeyboardFocus(C)`](./docs/components/overview.md#withkeyboardfocus) | HOC that adds keyboard focus to any `Pressable`/`Touchable`-like component. |

**API**

| Export | Purpose |
| :-- | :-- |
| [`announce` / `ScreenReader`](./docs/api/overview.md#announcements) | Reliable, navigation-aware announcements. |
| [`Keyboard`](./docs/api/overview.md#keyboard-module) | Dismiss the soft keyboard from a hardware keyboard. |
| [`KeyboardFocus` ref](./docs/api/overview.md#imperative-ref-keyboardfocus) | Imperative focus handle (`focus`, `keyboardFocus`, `screenReaderFocus`). |
| [Hooks](./docs/api/overview.md#hooks) | `useIsKeyboardConnected`, `useIsScreenReaderEnabled`, `useIsViewFocused`, … |
| [Focus-order props](./docs/api/overview.md#focus-order-props) | `orderId`, `order*`, `orderIndex`, `orderGroup`, `lockFocus`. |
| [`Legacy.*`](./docs/api/legacy.md) | Imperative 0.7 focus-order shim (`useFocusOrder`, …). |

---

## The rework

The original all-in-one `react-native-a11y` (0.7.0) was **split** into focused
packages to make each capability easier to develop, test, and support:

- [`react-native-a11y-order`](https://www.npmjs.com/package/react-native-a11y-order) — screen reader focus order & announcements
- [`react-native-external-keyboard`](https://www.npmjs.com/package/react-native-external-keyboard) — physical keyboard support
- [`react-native-is-keyboard-connected`](https://www.npmjs.com/package/react-native-is-keyboard-connected) — hardware keyboard connection status
- [`react-native-a11y-container`](https://www.npmjs.com/package/react-native-a11y-container) — iOS `UIAccessibilityContainer` grouping

Feature work on all of them is now complete, and they are **recombined here** into a single,
self-contained `react-native-a11y` — rebuilt fresh from the modern packages (whose native
bridges are newer than the legacy 0.7.0 code), not patched on top of the old one. It also
folds in an **optimistic-values** workaround as an alternative to
[`react-native-a11y-state-patch`](https://www.npmjs.com/package/react-native-a11y-state-patch).

What this means for you:

- **One unified namespace.** A single `A11y.View` / `A11y.Pressable` / `A11y.Input` takes
  both screen-reader and keyboard props; each capability is opt-in. A single
  `A11y.FocusTrap` / `A11y.FocusFrame` confines screen-reader **and** keyboard focus.
- **Everything in one place.** Screen-reader order, keyboard support, keyboard-connection
  status, iOS accessibility containers, and optimistic value announcements — no need to
  combine multiple libraries by hand.
- **Self-contained.** No runtime dependency on the split packages — install only
  `react-native-a11y`.
- **Migration shim.** The imperative 0.7 focus-order API lives under
  [`Legacy.*`](./docs/api/legacy.md) for a near drop-in upgrade.

Coming from 0.7 or any of the focused packages
(`react-native-a11y-order`, `react-native-external-keyboard`,
`react-native-is-keyboard-connected`, `react-native-a11y-container`)? Each path has its own
section in the [migration guide](./docs/migration/migration.md).

---

## Contributing

Any type of contribution is highly appreciated. Feel free to create PRs, raise issues, or
share ideas — see the [contributing guide](CONTRIBUTING.md) for the development workflow.

## Acknowledgements

This library stands on the work behind all of its source packages. Thanks to the initial
authors [Andrii Koval](https://github.com/ZioVio),
[Michail Chavkin](https://github.com/mchavkin), and
[Dzmitry Khamitsevich](https://github.com/bulletxenus), and to everyone who contributed,
reported issues, and followed along across `react-native-a11y-order`,
`react-native-external-keyboard`, `react-native-is-keyboard-connected`, and
`react-native-a11y-container`.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
