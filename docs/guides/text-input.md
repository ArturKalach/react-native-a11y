# Keyboard text input

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (keyboard-input-ios.gif) --> <img src="../images/keyboard-input-ios.gif" height="400" alt="Keyboard text input on iOS" /> | <!-- TODO: capture combined-package demo (keyboard-input-android.gif) --> <img src="../images/keyboard-input-android.gif" height="400" alt="Keyboard text input on Android" /> |

`A11y.Input` is a `TextInput` with physical-keyboard focus support. It lets the field
participate in keyboard focus navigation, customizes how it takes and releases focus
across platforms, and extends `onSubmitEditing` so it works for multiline inputs too.

```tsx
import { A11y } from 'react-native-a11y';

<A11y.Input
  value={text}
  onChangeText={setText}
  focusType="default"
  blurType="default"
/>
```

It accepts all standard `TextInputProps` plus the focus-specific props below. The
exported props type is `A11yInputProps`.

---

## `focusType` — how the field takes keyboard focus

iOS and Android differ in how a `TextInput` reacts when keyboard focus lands on it.
`focusType` lets you choose the behavior explicitly.

| Value | Behavior |
| :-- | :-- |
| `'default'` | Platform default. On Android the input is focused (editable) when keyboard focus reaches it; on iOS you press to start editing. |
| `'press'` | The input is focused for editing only after pressing **Space** while it has keyboard focus. |
| `'auto'` | The input starts editing automatically as soon as keyboard focus targets it. |

```tsx
// Editing begins as soon as Tab lands on the field
<A11y.Input focusType="auto" value={text} onChangeText={setText} />
```

---

## `blurType` — how the field releases focus (iOS)

> **iOS only.** Defines what happens to the input when keyboard focus moves away to
> another component.

| Value | Behavior |
| :-- | :-- |
| `'default'` | iOS keeps the input active — you can keep typing even though keyboard focus is on another component. |
| `'disable'` | The input blurs when keyboard focus leaves it. |
| `'auto'` | Automatic blur handling. |

```tsx
<A11y.Input blurType="disable" value={text} onChangeText={setText} />
```

---

## Multiline & submit handling

A standard multiline `TextInput` does not fire `onSubmitEditing` on Enter (Enter inserts
a newline). `A11y.Input` extends submit handling so `onSubmitEditing` works for multiline
fields as well, which is useful for hardware-keyboard "send on Enter" flows.

```tsx
<A11y.Input
  multiline
  value={message}
  onChangeText={setMessage}
  submitBehavior="blurAndSubmit"
  onSubmitEditing={(e) => send(e.nativeEvent.text)}
/>
```

| Prop | Type | Notes |
| :-- | :-- | :-- |
| `multiline` | `boolean` | Standard `TextInput` prop. Enables multiline submit handling. |
| `onSubmitEditing` | `(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void` | Fires on submit — including multiline, unlike a plain `TextInput`. |
| `submitBehavior` | `'submit' \| 'blurAndSubmit' \| 'newline'` | Standard `TextInput` prop. `'blurAndSubmit'` blurs the field on submit; this also drives the internal `blurOnSubmit` behavior. |

> [!NOTE]
> When `submitBehavior` is set, it governs whether the field blurs on submit
> (`'blurAndSubmit'` → blur). When it is omitted, the field falls back to the standard
> `blurOnSubmit` default (`true`).

---

## Focus styling

Like other components, the input supports per-platform native indicators and your own
focus styles. See [Native focus styling](./focus-styling.md) for the full picture.

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `focusable` | `boolean` | `true` | Whether the input can be keyboard-focused. Also controls `editable`. |
| `haloEffect` | `boolean` | `true` | *(iOS)* Halo ring on focus. |
| `roundedHaloFix` | `boolean` | `false` | *(iOS)* **Deprecated & ignored** — a disabled halo no longer reappears on rounded views. Removed next major. |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | *(Android)* Default focus highlight. |
| `tintType` | `'default' \| 'none'` | `'default'` | Cross-platform shortcut: `'none'` disables the native focus indicator on both platforms (iOS halo + Android highlight). [Details](./focus-styling.md#turning-off-all-native-indicators). |
| `tintColor` | `string` | — | *(iOS)* Halo / tint color. |
| `style` | `StyleProp<ViewStyle>` | — | Style for the inner `TextInput`. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the inner input when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Container style when focused. |
| `onFocusChange` | `(isFocused: boolean) => void` | — | Called on focus or blur. |

```tsx
<A11y.Input
  value={text}
  onChangeText={setText}
  tintColor="dodgerblue"
  focusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  onFocusChange={(isFocused) => setActive(isFocused)}
/>
```

---

## Focus order

`A11y.Input` participates in keyboard focus ordering just like any other component — it
accepts the `orderId` / `order*`, `orderIndex` / `orderGroup`, and `lockFocus` props. See
[Keyboard focus order](./focus-order.md).

---

## Related

- [Native focus styling](./focus-styling.md)
- [Keyboard focus order](./focus-order.md)
- [Component overview → A11y.Input](../components/overview.md#a11yinput)

---

← [Programmatic focus](./programmatic-focus.md) · [Keyboard focus order →](./focus-order.md)
