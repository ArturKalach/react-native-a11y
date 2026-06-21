# Screen-reader focus order

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (sr-order-ios.gif) --> <img src="../images/sr-order-ios.gif" height="400" alt="Screen reader order on iOS" /> | <!-- TODO: capture combined-package demo (sr-order-android.gif) --> <img src="../images/sr-order-android.gif" height="400" alt="Screen reader order on Android" /> |

`A11y.Order` and `A11y.Index` let you define an explicit **screen-reader** traversal
sequence (VoiceOver / TalkBack) that is independent of the visual render order.

> [!IMPORTANT]
> This is the screen-reader ordering system. For physical-keyboard `Tab` / arrow order,
> use the `order*` props described in [Keyboard focus order](./focus-order.md). The two
> are separate.

## The problem

The layout your designer wants and the focus order your users need are often different
things. By default the screen reader follows the native view hierarchy — which matches
render order, not the visual layout. In practice this means focus can move in unexpected
directions: clockwise around a card grid instead of row by row, bottom-to-top through a
chat thread, diagonally across a table, or back-and-forth between columns in a flex
layout that renders column-first.

## Basic usage

Wrap elements in `A11y.Order` and give each one an `A11y.Index` with a numeric position.
Lower numbers are focused first; ties are broken by render order.

```tsx
import { A11y } from 'react-native-a11y';

<A11y.Order>
  <A11y.Index index={1}>
    <Text>Focused first</Text>
  </A11y.Index>
  <A11y.Index index={3}>
    <Text>Focused third</Text>
  </A11y.Index>
  <A11y.Index index={2}>
    <Text>Focused second</Text>
  </A11y.Index>
</A11y.Order>
```

## Rules

- Every `A11y.Index` must be inside an `A11y.Order`. Using `A11y.Index` outside an order
  container throws a runtime error.
- `index` values do not need to be consecutive — gaps are fine.
- Fractional values work if you need to insert an element between two existing positions.

## Programmatic focus

The ref on `A11y.Index` exposes a `focus()` method that moves screen-reader focus
programmatically.

```tsx
import { A11y } from 'react-native-a11y';
import { useRef } from 'react';

const ref = useRef<{ focus: () => void }>(null);

<A11y.Order>
  <A11y.Index ref={ref} index={1}>
    <Text>Target</Text>
  </A11y.Index>
</A11y.Order>

<Button title="Focus target" onPress={() => ref.current?.focus()} />
```

The ref also exposes all standard native view methods (`measure`, `measureInWindow`,
etc.).

## Dynamic reordering

`A11y.Order` re-evaluates the sequence whenever `index` values change. You can reorder
elements at runtime by updating state.

```tsx
const [reverse, setReverse] = React.useState(false);

<A11y.Order>
  <A11y.Index index={reverse ? 2 : 1}>
    <Text>Item A</Text>
  </A11y.Index>
  <A11y.Index index={reverse ? 1 : 2}>
    <Text>Item B</Text>
  </A11y.Index>
</A11y.Order>
```

## `screenReaderFocusTarget` — which element gets focused

Controls which element within the `A11y.Index` subtree actually receives screen-reader
focus.

| Value | Behavior |
| :-- | :-- |
| `'self'` | The `A11y.Index` view itself is the focused element (default). Navigation moves through inner elements before advancing to the next index. |
| `'firstAccessible'` | Searches the child tree for the first accessible element. Useful when the index wrapper has no visual presence. This is the default for wrapper components (`focusableWrapper`). |
| `'child'` | Targets the first direct child view of the wrapper without checking accessibility properties or traversing deeper (the legacy "subview" behavior). |

```tsx
<A11y.Index index={1} screenReaderFocusTarget="firstAccessible">
  <View>
    <Text accessible accessibilityLabel="The actual element">Label</Text>
  </View>
</A11y.Index>
```

> [!NOTE]
> `screenReaderFocusTarget` drives the **screen-reader** target only; keyboard focus
> targeting is controlled separately by `focusableWrapper`. The old `orderType` values
> (`'default' | 'child' | 'subview'`) map to `'self' | 'child' | 'firstAccessible'` — see
> the [migration guide](../migration/migration.md#from-react-native-a11y-order). The
> `orderType` prop now selects which **engine** applies (`'auto' | 'keyboard' |
> 'screen-reader'`).

## `A11y.Index` props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `index` | `number` | Position in the screen-reader sequence. Lower = focused first. |
| `screenReaderFocusTarget` | `'self' \| 'firstAccessible' \| 'child'` | Which element receives focus. Defaults to `'self'`. |
| `orderType` | `'auto' \| 'keyboard' \| 'screen-reader'` | Which ordering engine applies. Defaults to `'auto'`. |
| `a11yUIContainer` | `'none' \| 'table' \| 'list' \| 'landmark' \| 'group'` | *(iOS only)* Sets `UIAccessibilityContainerType`. See [iOS semantic containers](./a11y-ui-container.md). |
| `shouldGroupAccessibilityChildren` | `boolean` | *(iOS only)* When `true`, VoiceOver reads all descendants as one combined element. |
| `onScreenReaderFocused` | `() => void` | Fires when this element receives screen-reader focus. |
| `onScreenReaderSubViewFocused` | `() => void` | Fires when screen-reader focus enters any descendant. |
| `onScreenReaderSubViewBlurred` | `() => void` | Fires when screen-reader focus leaves any descendant. |
| `onScreenReaderSubViewFocusChange` | `(isFocused: boolean) => void` | Fires on any focus state change for a descendant. |
| `onScreenReaderDescendantFocusChanged` | `(e: ScreenReaderDescendantFocusChangedEvent) => void` | Fires when any descendant gains or loses focus. Payload `{ status: 'focused' \| 'blurred', nativeId?: string }`. |
| `ref` | `React.Ref` | Exposes `focus()` and all native view methods. |
| `...ViewProps` | — | All standard React Native View properties (and all keyboard focus props — see [`A11y.View`](../components/overview.md#a11yview)). |

## `A11y.Order` props

`A11y.Order` accepts all standard React Native `ViewProps`. No additional props.

## Related

- [Screen-reader focus events](./focus-events.md)
- [Keyboard focus order](./focus-order.md) — the *other* ordering system

---

← [Keyboard focus order](./focus-order.md) · [Cards with inner buttons →](./a11y-card.md)
