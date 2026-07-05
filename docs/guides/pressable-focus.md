# Pressable focus handling

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (keyboard-pressable-ios.gif) --> <img src="../images/keyboard-pressable-ios.gif" height="400" alt="Pressable focus on iOS" /> | <!-- TODO: capture combined-package demo (keyboard-pressable-android.gif) --> <img src="../images/keyboard-pressable-android.gif" height="400" alt="Pressable focus on Android" /> |

This guide covers how a keyboard-focusable component reports focus and how to style it:
the focus lifecycle events (`onFocus`, `onBlur`, `onFocusChange`), the state-driven style
callbacks (`style`, `containerStyle`), and the two render props (`renderContent`,
`renderFocusable`).

Everything here applies to `A11y.Pressable`, `A11y.View`, and any component created with
[`withKeyboardFocus`](../components/overview.md#withkeyboardfocus).

`A11y.Pressable` is a ready-made, keyboard-focusable `Pressable` — there's nothing to
set up:

```tsx
import { A11y } from 'react-native-a11y';

<A11y.Pressable
  onPress={onPress}
  style={({ focused }) => focused && { backgroundColor: 'dodgerblue' }}
>
  <Text>Item</Text>
</A11y.Pressable>
```

For your own touchables (a custom button, `TouchableOpacity`, …), wrap them with
`withKeyboardFocus`:

```tsx
import { withKeyboardFocus } from 'react-native-a11y';
import { Pressable, TouchableOpacity } from 'react-native';

const KeyboardPressable = withKeyboardFocus(Pressable); // same as A11y.Pressable
const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

The examples below use `A11y.Pressable`, but any `withKeyboardFocus` component behaves
the same way.

---

## Focus & blur events

A keyboard-focusable component fires events as physical-keyboard focus moves in and out
of it. These are independent of press events — they fire on `Tab` / `Shift + Tab` /
arrow navigation, not on activation.

| Event | Fires when | Signature |
| :-- | :-- | :-- |
| `onFocus` | The component gains keyboard focus. | `() => void` |
| `onBlur` | The component loses keyboard focus. | `() => void` |
| `onFocusChange` | On focus **and** blur. | `(isFocused: boolean, tag?: number) => void` |

```tsx
<A11y.Pressable
  onFocus={() => console.log('focused')}
  onBlur={() => console.log('blurred')}
  onFocusChange={(isFocused, tag) => console.log({ isFocused, tag })}
  onPress={onPress}
>
  <Text>Item</Text>
</A11y.Pressable>
```

`onFocusChange` is the convenient one for driving a single piece of state:

```tsx
const [focused, setFocused] = useState(false);

<A11y.Pressable onFocusChange={setFocused} onPress={onPress}>
  <Text>{focused ? 'Focused' : 'Not focused'}</Text>
</A11y.Pressable>
```

> [!NOTE]
> Focus events fire regardless of `disabled`. A `disabled` component can still be
> focused and reported via `onFocus` / `onBlur`; only the synthesized `onPress` is
> suppressed while disabled.

---

## Styling the focused state

`style` and `containerStyle` each accept a **static style/array** or a **callback that
receives `{ focused, pressed }`** — one consistent shape for both keyboard focus and
press. Two layers:

| Prop | Applies to |
| :-- | :-- |
| `style` | The **inner** component (the pressable surface). |
| `containerStyle` | The **outer** container — outlines/rings around the whole element. |

```tsx
<A11y.Pressable
  style={({ focused, pressed }) => [
    styles.button,
    focused && { backgroundColor: 'dodgerblue' },
    pressed && { opacity: 0.85 },
  ]}
  containerStyle={({ focused }) => [
    styles.container,
    focused && { borderColor: 'dodgerblue', borderWidth: 2 },
  ]}
  onPress={onPress}
>
  <Text>Styled on focus</Text>
</A11y.Pressable>
```

Pass a plain style/array when you don't need the state:

```tsx
<A11y.Pressable style={styles.button} containerStyle={styles.container} onPress={onPress}>
  <Text>Static</Text>
</A11y.Pressable>
```

> [!NOTE]
> **Deprecated: `focusStyle` / `containerFocusStyle`.** Earlier versions used separate
> focus-only props. They still work but are deprecated — prefer the unified callback,
> which also gives you `pressed`: `style={(s) => (s.focused ? focusedStyle : baseStyle)}`.
> (`withPressedStyle` is likewise deprecated — the pressed callback is enabled
> automatically when `style` is a function.)

---

## Render props: `renderContent` vs `renderFocusable`

When you need the `focused` flag **inside** the children (not just as a style), use a
render prop. Which one depends on the wrapped component.

### `renderContent` — components with a render-prop `children`

`Pressable` passes its own `{ pressed }` state to a `children` function. `renderContent`
merges that state with `{ focused }`, so you can react to both at once:

```tsx
<A11y.Pressable
  onPress={onPress}
  renderContent={({ pressed, focused }) => (
    <View
      style={[
        styles.button,
        pressed && styles.pressed,
        focused && styles.focused,
      ]}
    >
      <Text>{pressed ? 'Pressed' : focused ? 'Focused' : 'Default'}</Text>
    </View>
  )}
/>
```

### `renderFocusable` — any other component

`TouchableOpacity` and most components do not expose a render-prop `children`, so
`renderContent` isn't available. `renderFocusable` replaces `children` and receives only
`{ focused }`:

```tsx
const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);

<KeyboardTouchable
  onPress={onPress}
  renderFocusable={({ focused }) => (
    <View style={[styles.button, focused && styles.focused]}>
      <Text>{focused ? 'Focused' : 'Default'}</Text>
    </View>
  )}
/>
```

### Which should I use?

| Situation | Use |
| :-- | :-- |
| Only need a style change on focus/press | `style` / `containerStyle` callback |
| Need `focused` inside the rendered content | `renderFocusable` |
| Wrapped `Pressable` and need `pressed` + `focused` together | `renderContent` |

---

## Related

- [Native focus styling](./focus-styling.md) — halo, tint, Android highlight
- [Programmatic focus](./programmatic-focus.md) — focus from a `ref`
- [Component overview → withKeyboardFocus](../components/overview.md#withkeyboardfocus) — full props table

---

← [Getting started](../getting-started/getting-started.md) · [Native focus styling →](./focus-styling.md)
