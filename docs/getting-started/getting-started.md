# Getting Started

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (getting-started-ios.gif) --> <img src="../images/getting-started-ios.gif" height="400" alt="react-native-a11y on iOS" /> | <!-- TODO: capture combined-package demo (getting-started-android.gif) --> <img src="../images/getting-started-android.gif" height="400" alt="react-native-a11y on Android" /> |

`react-native-a11y` adds two accessibility capabilities to a React Native app, under
one `A11y.*` namespace:

- **Screen reader** (VoiceOver / TalkBack) — custom focus/traversal order, cards with
  accessible inner buttons, focus traps, iOS semantic containers, and reliable
  announcements.
- **Physical keyboard** — keyboard focus management, key-press events, focus order,
  focus styling, and focus locking.

Each capability is **opt-in**: a component does keyboard work only when you give it
keyboard props, and screen-reader work only when you give it screen-reader props.

> [!NOTE]
> `react-native-a11y` is self-contained and **mutually exclusive** with
> `react-native-a11y-order` and `react-native-external-keyboard` — install exactly
> one. Use this package when you want both screen-reader and keyboard support; use a
> split package if you only need one.

## Requirements

- React Native 0.71 or later
- iOS 13+ / Android API 21+
- Expo SDK 49+ (bare workflow / prebuild)

## Architecture support

| Architecture | Supported |
| :-- | :-- |
| New Architecture (Fabric / Turbo Modules) | Yes |
| Old Architecture (Bridge) | Yes |
| Bridgeless mode | Yes |

## Installation

```sh
npm install react-native-a11y
```

```sh
yarn add react-native-a11y
```

### iOS

Run pod install after adding the package:

```sh
cd ios && pod install && cd ..
```

### Expo

Compatible with Expo prebuild — no config plugin is required. The library uses native
code, so it does **not** run in Expo Go:

```sh
npx expo prebuild
```

## Quick start

Everything is imported from the single `A11y` namespace, with the imperative APIs,
hooks, and the keyboard-focus HOC at the top level.

### Keyboard focus

`A11y.Pressable`, `A11y.View`, and `A11y.Input` are keyboard-focusable out of the box —
move focus with `Tab` / `Shift + Tab`, activate with `Space` or `Enter`:

```tsx
import { A11y } from 'react-native-a11y';
import { Text } from 'react-native';

export default function App() {
  return (
    <A11y.Pressable
      autoFocus
      onPress={() => console.log('activated')}
      focusStyle={{ backgroundColor: 'dodgerblue' }}
      onFocus={() => console.log('focused')}
      onBlur={() => console.log('blurred')}
    >
      <Text>Press me with Space or Enter</Text>
    </A11y.Pressable>
  );
}
```

> [!NOTE]
> On iOS, long-pressing the spacebar does **not** fire a long press — iOS routes that
> through *Full Keyboard Access*. Use `Tab + M` (the default "open context menu"
> command) instead, via `onContextMenuPress`.

### Screen-reader order & announcements

`A11y.Order` + `A11y.Index` define an explicit screen-reader traversal sequence,
independent of render order; `announce` posts a message to the screen reader:

```tsx
import { A11y, announce } from 'react-native-a11y';
import { Text, Button } from 'react-native';

<A11y.Order>
  <A11y.Index index={1}><Text>Read first</Text></A11y.Index>
  <A11y.Index index={3}><Text>Read third</Text></A11y.Index>
  <A11y.Index index={2}><Text>Read second</Text></A11y.Index>
</A11y.Order>;

<Button title="Save" onPress={() => announce('Changes saved')} />;
```

### Both at once

`A11y.View` is one component that accepts both prop sets. Give it keyboard props,
screen-reader props, or both — unused capabilities cost nothing:

```tsx
<A11y.View
  // keyboard
  focusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  onKeyDownPress={(e) => console.log(e.nativeEvent.unicodeChar)}
  // screen reader
  a11yUIContainer="list"
  onScreenReaderFocused={() => console.log('SR focused')}
  accessibilityLabel="Menu. 4 items."
>
  {/* …items… */}
</A11y.View>
```

### Wrapping your own components

To add keyboard focus to a component the namespace doesn't cover — `TouchableOpacity`,
a custom button, a third-party component — wrap it with the `withKeyboardFocus` HOC:

```tsx
import { withKeyboardFocus } from 'react-native-a11y';
import { TouchableOpacity } from 'react-native';

const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

See [Pressable focus handling](../guides/pressable-focus.md) for events, styling, and
render props.

## What's available

| Export | Purpose |
| :-- | :-- |
| [`A11y.View` / `A11y.Pressable` / `A11y.Input`](../components/overview.md) | Unified focusable view / pressable / text input |
| [`A11y.Order` / `A11y.Index`](../guides/a11y-order.md) | Declarative screen-reader traversal order |
| [`A11y.Card`](../guides/a11y-card.md) | Card with accessible inner interactive elements |
| [`A11y.FocusTrap` / `A11y.FocusFrame`](../guides/focus-lock.md) | Confine SR + keyboard focus to a region |
| [`A11y.PaneTitle` / `A11y.ScreenChange`](../guides/announcements.md) | Screen / panel transition announcements |
| [`A11y.FocusGroup`](../components/overview.md#a11yfocusgroup) | iOS focus group + shared `tintColor` |
| [`announce` / `cancel` / `cancelAll` / `ScreenReader`](../guides/announcements.md) | Programmatic announcements |
| [`Keyboard`](../api/overview.md#keyboard-module) | Dismiss the soft keyboard from a hardware keyboard |
| [`withKeyboardFocus`](../components/overview.md#withkeyboardfocus) | Add keyboard focus to any touchable |
| [`useIsKeyboardConnected` / `useIsScreenReaderEnabled`](../guides/keyboard-connection-status.md) | Runtime status hooks |

## Deprecated aliases

For an easier move from the split packages, the old namespaces are kept as deprecated
aliases of the unified components. Prefer the `A11y.*` names in new code.

| Deprecated | Use instead |
| :-- | :-- |
| `K.View` / `K.Pressable` / `K.Input` | `A11y.View` / `A11y.Pressable` / `A11y.Input` |
| `Focus.Frame` / `Focus.Trap` | `A11y.FocusFrame` / `A11y.FocusTrap` |
| `KeyboardFocusTextInput` | `A11y.Input` |

---

**Next:** [Pressable focus handling →](../guides/pressable-focus.md) — the everyday keyboard workflow.

**Reference:** [Component overview →](../components/overview.md) — the full props tables.
