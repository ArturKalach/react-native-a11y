# API reference

The non-component surface of `react-native-a11y`: announcements, the `Keyboard` module,
the `withKeyboardFocus` HOC contract, the imperative ref, hooks, status functions,
focus-order props, and shared types.

- [Announcements](#announcements)
- [`Keyboard` module](#keyboard-module)
- [`withKeyboardFocus` HOC](#withkeyboardfocus-hoc)
- [Imperative ref: `KeyboardFocus`](#imperative-ref-keyboardfocus)
- [Hooks](#hooks)
- [Status functions](#status-functions)
- [Provider & utilities](#provider--utilities)
- [Focus-order props](#focus-order-props)
- [Types](#types)
- [`Legacy.*` namespace](./legacy.md)

---

## Announcements

```tsx
import { announce, cancel, cancelAll, ScreenReader } from 'react-native-a11y';
```

| Function | Description |
| :-- | :-- |
| `announce(message, options?)` | Posts an announcement. Direct mode by default unless `calm: true` is passed. Returns `Promise<AnnouncementResult>`. |
| `cancel(id)` | Cancels the announcement with the given `id`. |
| `cancelAll()` | Cancels all pending and active announcements. |
| `ScreenReader.announce(message, options?)` | Calm-mode (navigation-aware) announcement. Waits for transitions to settle. |
| `ScreenReader.cancel(id)` / `ScreenReader.cancelAll()` | Same as the standalone functions. |

See the [Announcements guide](../guides/announcements.md) for usage and mode behavior.

### `AnnounceOptions`

| Option | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `priority` | `AnnouncePriority` | `'default'` | Urgency / queue insertion order. iOS 17+: maps to `UIAccessibilityPriority`. |
| `queue` | `boolean` | `true` | When `true`, waits for current speech; when `false`, may interrupt. |
| `calm` | `boolean` | `false` | Navigation-aware mode. Waits for transitions and a focused element. |
| `delayMs` | `number` | `0` | Delay (ms) before posting. Ignored in calm mode. |
| `speech` | `SpeechOptions` | — | iOS-only speech characteristics. No-op on Android; direct mode only. |

### `AnnouncePriority`

```ts
type AnnouncePriority = 'low' | 'default' | 'high';
```

| Value | Behaviour |
| :-- | :-- |
| `'low'` | Spoken only when the screen reader is fully idle. |
| `'default'` | Standard queued announcement. |
| `'high'` | May preempt lower-priority pending items. |

### `SpeechOptions` (iOS only)

| Option | Type | Description |
| :-- | :-- | :-- |
| `language` | `string` | BCP-47 language tag (e.g. `'fr-FR'`). Defaults to the system language. |
| `pitch` | `number` | Voice pitch multiplier, range `0.0`–`2.0`. Default `1.0`. |
| `spellOut` | `boolean` | Spell each character individually. |
| `punctuation` | `boolean` | Read punctuation marks aloud. |
| `ipaNotation` | `string` | IPA pronunciation hint applied to the whole string. |

### `AnnouncementResult` / `AnnounceStatus`

```ts
type AnnounceStatus = 'spoken' | 'fired' | 'cancelled';
type AnnouncementResult = { id: string; status: AnnounceStatus };
```

| `status` | Meaning |
| :-- | :-- |
| `'spoken'` | VoiceOver confirmed full speech (iOS direct mode only). |
| `'fired'` | Posted; completion not confirmed. Always the case on Android; iOS calm mode resolves here once fired. |
| `'cancelled'` | Explicitly cancelled via `cancel()` / `cancelAll()`. |

---

## Keyboard module

Dismisses the soft (on-screen) keyboard — useful when typing on a hardware keyboard while
the soft keyboard is still showing.

```tsx
import { Keyboard } from 'react-native-a11y';

Keyboard.dismiss();
```

| Function | Platform | Description |
| :-- | :-- | :-- |
| `Keyboard.dismiss()` | iOS / Android | Hides the soft keyboard. |

On Android the call goes through React Native's `Keyboard.dismiss()` **and** the library's
native dismiss, because with a hardware keyboard attached Android's framework dismiss alone
does not always hide the soft keyboard.

> The soft keyboard can also be hidden by the user from system settings or by pressing
> `Alt + K`.

---

## withKeyboardFocus HOC

```tsx
function withKeyboardFocus<C>(Component: C): KeyboardFocusableComponent<C>;
```

Wraps any `Pressable`/`Touchable`-like component and returns a new component that:

- forwards focus/blur via `onFocus`, `onBlur`, `onFocusChange`;
- applies `focusStyle` / `containerFocusStyle` based on focus state;
- supports `autoFocus`, `triggerCodes`, and the `KeyboardFocus` ref;
- exposes the wrapped component's render state through `renderContent` / `renderFocusable`.

`A11y.Pressable` is `withKeyboardFocus(Pressable)`. See the
[component docs](../components/overview.md#withkeyboardfocus) for the full props table.

### Render props

| Prop | Receives | Available when |
| :-- | :-- | :-- |
| `renderContent` | the component's own render state merged with `{ focused }` | the wrapped component's `children` is a render function (e.g. `Pressable`) |
| `renderFocusable` | `{ focused }` only | always — for components without a render-prop `children` (e.g. `TouchableOpacity`) |

---

## Imperative ref: `KeyboardFocus`

Keyboard-focusable components expose an imperative handle through `ref`.

```tsx
import { useRef } from 'react';
import { A11y, type KeyboardFocus } from 'react-native-a11y';

const ref = useRef<KeyboardFocus>(null);

<A11y.Pressable ref={ref} onPress={onPress}>
  <Text>Target</Text>
</A11y.Pressable>;
```

| Method | Description |
| :-- | :-- |
| `focus()` | Moves **both** physical-keyboard and screen-reader focus to this element. |
| `keyboardFocus()` | Moves physical-keyboard focus only. |
| `screenReaderFocus()` | Moves screen-reader (VoiceOver / TalkBack) focus only. |

The handle is a proxy: any property other than the three methods above falls through to
the underlying native view, so standard `View` methods (`measure`, `setNativeProps`,
`blur`, …) work off the same ref. To reach the wrapped component instance itself, use the
`componentRef` prop. See [Programmatic focus](../guides/programmatic-focus.md).

---

## Hooks

| Hook | Signature | Description |
| :-- | :-- | :-- |
| `useIsKeyboardConnected` | `(ignoreWarn?: boolean) => boolean` | Whether a physical keyboard is connected; re-renders on change. [Guide](../guides/keyboard-connection-status.md). |
| `useIsKeyboardConnectedRef` | `(ignoreWarn?: boolean) => MutableRefObject<boolean>` | Ref variant — no re-render. |
| `useIsScreenReaderEnabled` | `() => boolean` | Whether a screen reader is enabled; re-renders on change. |
| `useIsScreenReaderEnabledRef` | `() => MutableRefObject<boolean>` | Ref variant — no re-render. |
| `useIsViewFocused` | `() => boolean` | Whether the nearest keyboard-focusable ancestor is currently focused. Read from a descendant. |
| `useOrderFocusGroup` | `() => OrderFocusGroupContext` | Current keyboard focus-order group context. Provided by `KeyboardOrderFocusGroup`. |

Related context exports: `KeyboardOrderFocusGroup`, `OrderFocusGroupContext`.

---

## Status functions

Non-hook access to the same status, for use outside React components.

| Function | Description |
| :-- | :-- |
| `isKeyboardConnected()` | `Promise<boolean>` — current physical-keyboard connection state. |
| `keyboardStatusListener(cb)` | Subscribe to keyboard connect/disconnect. `cb` receives `{ status: boolean }`. Returns an unsubscribe function. |
| `isScreenReaderEnabled()` | `Promise<boolean>` — current screen-reader state. |
| `screenReaderStatusListener(cb)` | Subscribe to screen-reader enable/disable. `cb` receives `{ status: boolean }`. Returns an unsubscribe function. |

```ts
type StatusCallback = (event: { status: boolean }) => void;
```

---

## Provider & utilities

| Export | Description |
| :-- | :-- |
| `A11yProvider` | Optional status provider kept for backward compatibility. |
| `combineRefs(...refs)` | Utility to merge multiple refs (callback or object refs) into one. |
| `withKeyboardFocus(Component)` | The HOC documented [above](#withkeyboardfocus-hoc). |

---

## Focus-order props

These props drive **physical-keyboard** ordering and appear on every keyboard-focusable
component. There are three independent systems; they can be combined. See the
[Keyboard focus order guide](../guides/focus-order.md).

### Link-based

| Prop | Type | Description |
| :-- | :-- | :-- |
| `orderId` | `string` | Unique ID used as the link target for other elements. |
| `orderForward` | `string` | Target focused on forward navigation (`Tab`). |
| `orderBackward` | `string` | Target focused on backward navigation (`Shift + Tab`). |
| `orderLeft` / `orderRight` | `string` | Target focused when navigating left / right. |
| `orderUp` / `orderDown` | `string` | Target focused when navigating up / down. |
| `orderFirst` / `orderLast` | `string \| null` | *(iOS)* Target when jumping to the first / last element. `null` clears the link. |
| `orderPrefix` | `string` | Prefix prepended to this element's `orderId` and all `order*` targets, to keep IDs unique. |

> [!IMPORTANT]
> `orderId` values are **global**. In repeated content, duplicate IDs cause incorrect
> focus jumps. Namespace them with `orderPrefix` or wrap the subtree in
> [`KeyboardOrderFocusGroup`](../components/overview.md#keyboardorderfocusgroup). Using a
> link prop with no prefix logs a console warning.

### Index-based

| Prop | Type | Description |
| :-- | :-- | :-- |
| `orderGroup` | `string` | Name of the group containing ordered elements. |
| `orderIndex` | `number` | Position within the group; lower indices are focused first. |

### Direction locking

| Prop | Type | Description |
| :-- | :-- | :-- |
| `lockFocus` | [`LockFocusType[]`](#lockfocustype) | Directions in which focus movement is blocked. |

---

## Types

### `OrderType`

```ts
type OrderType = 'auto' | 'keyboard' | 'screen-reader';
```

Which ordering engine applies to a focus-aware view: `'auto'` (both), `'keyboard'`
(physical-keyboard order only), or `'screen-reader'` (VoiceOver / TalkBack order only).

### `ScreenReaderFocusTarget`

```ts
type ScreenReaderFocusTarget = 'self' | 'firstAccessible' | 'child';
```

Which element the screen reader treats as a view's focus / traversal node. Keyboard focus
targeting is controlled separately by `focusableWrapper`. See
[Screen-reader focus order](../guides/a11y-order.md#screenreaderfocustarget--which-element-gets-focused).

### `A11yOptimisticConfig` (iOS)

```ts
type A11yOptimisticConfig = {
  increase?: string;
  decrease?: string;
  activate?: string;
  state?: boolean;
};
```

iOS-only predicted accessibility values. See
[Optimistic accessibility values](../guides/optimistic-state.md).

### `KeyPress`

Payload of `onKeyDownPress` / `onKeyUpPress`, delivered as `OnKeyPress`
(`NativeSyntheticEvent<KeyPress>` — read it via `e.nativeEvent`).

| Field | Type | Description |
| :-- | :-- | :-- |
| `keyCode` | `number` | Platform key code. |
| `unicode` | `number` | Unicode code point of the key. |
| `unicodeChar` | `string` | Character produced by the key. |
| `isLongPress` | `boolean` | Whether this is a long press. |
| `isAltPressed` | `boolean` | `Alt` modifier held. |
| `isShiftPressed` | `boolean` | `Shift` modifier held. |
| `isCtrlPressed` | `boolean` | `Ctrl` modifier held. |
| `isCapsLockOn` | `boolean` | Caps Lock active. |
| `hasNoModifiers` | `boolean` | No modifier keys held. |

```ts
type OnKeyPress = NativeSyntheticEvent<KeyPress>;
type OnKeyPressFn = (e: OnKeyPress) => void;
```

### `OnFocusChangeFn`

```ts
type OnFocusChangeFn = (isFocused: boolean, tag?: number) => void;
```

### `FocusStyle`

A style applied based on focus state — either a static style or a callback.

```ts
type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: { readonly focused: boolean }) => StyleProp<ViewStyle>)
  | undefined;
```

### `LockFocusType`

```ts
type LockFocusType =
  | 'up' | 'down' | 'left' | 'right'
  | 'forward' | 'backward'
  | 'first' | 'last';
```

- `up` / `down` / `left` / `right` — block directional (arrow / DPad) movement.
- `forward` / `backward` — block `Tab` and `Shift + Tab`.
- `first` / `last` — *(iOS)* block jumping to the first / last focusable element.

The matching enum `LockFocusEnum` is also exported.

### Other exported types

| Type | Description |
| :-- | :-- |
| `KeyboardFocus` | Imperative ref handle (`focus`, `keyboardFocus`, `screenReaderFocus`). |
| `BaseKeyboardViewType` / `BaseKeyboardViewProps` | The native focusable view's type / props. |
| `A11yViewProps`, `A11yPressableProps`, `A11yInputProps` | Props for the unified components. |
| `A11yCardProps`, `A11yFocusTrapProps`, `A11yFocusFrameProps` | Props for `A11y.Card` / lock components. |
| `A11yPaneTitleProps`, `A11yScreenChangeProps`, `A11yPaneType` | Props for the announcement components. |
| `A11yOrderProps`, `A11yIndexProps`, `A11yFocusGroupProps` | Props for ordering / grouping components. |
| `ScreenReaderCallbacks`, `ScreenReaderDescendantFocusChangedEvent` | Screen-reader focus event types. |
| `A11yUIContainerType` | iOS container type union. |
| `KeyboardFocusableComponent`, `WithKeyboardFocusProps` | The `withKeyboardFocus` HOC contract. |

---

← [Component overview](../components/overview.md) · [Legacy API →](./legacy.md) · [Migration guide →](../migration/migration.md)
