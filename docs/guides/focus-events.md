# Screen-reader focus events

`A11y.View` and `A11y.Index` expose a set of callbacks that fire as screen-reader focus
enters and leaves elements. Use these to track which element has focus, show/hide UI, or
log analytics.

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (focus-events-ios.gif) --> <img src="../images/focus-events-ios.gif" height="400" alt="Focus events on iOS" /> | <!-- TODO: capture combined-package demo (focus-events-android.gif) --> <img src="../images/focus-events-android.gif" height="400" alt="Focus events on Android" /> |

> [!NOTE]
> These are **screen-reader** focus events (VoiceOver / TalkBack). For physical-keyboard
> focus events (`onFocus` / `onBlur` / `onFocusChange`), see
> [Pressable focus handling](./pressable-focus.md).

## Available events

| Event | Fires when |
| :-- | :-- |
| `onScreenReaderFocused` | This element itself receives screen-reader focus. |
| `onScreenReaderSubViewFocused` | Screen-reader focus enters any descendant. |
| `onScreenReaderSubViewBlurred` | Screen-reader focus leaves any descendant. |
| `onScreenReaderSubViewFocusChange` | Any descendant focus state change. Receives `(isFocused: boolean)`. |
| `onScreenReaderDescendantFocusChanged` | Any descendant gains or loses focus. Receives a `ScreenReaderDescendantFocusChangedEvent` with `{ status: 'focused' \| 'blurred', nativeId?: string }`. |

## Basic focus tracking

```tsx
import { A11y } from 'react-native-a11y';

<A11y.View
  onScreenReaderFocused={() => console.log('element focused')}
  onScreenReaderSubViewFocused={() => console.log('child focused')}
  onScreenReaderSubViewBlurred={() => console.log('child blurred')}
>
  <View accessible accessibilityLabel="Some content">
    <Text>Content</Text>
  </View>
</A11y.View>
```

## Descendant focus tracking

`onScreenReaderDescendantFocusChanged` gives you both the status and the `nativeID` of the
element that changed focus:

```tsx
import {
  A11y,
  type ScreenReaderDescendantFocusChangedEvent,
} from 'react-native-a11y';

<A11y.View
  onScreenReaderDescendantFocusChanged={(
    e: ScreenReaderDescendantFocusChangedEvent
  ) => {
    const { status, nativeId } = e.nativeEvent;
    console.log(`${nativeId} is now ${status}`);
  }}
>
  <View nativeID="item-1" accessible accessibilityLabel="Item 1">
    <Text>Item 1</Text>
  </View>
  <View nativeID="item-2" accessible accessibilityLabel="Item 2">
    <Text>Item 2</Text>
  </View>
</A11y.View>
```

## Combining with A11y.Order

Focus events work on `A11y.Index` too — use them when you need ordering and event
tracking together:

```tsx
<A11y.Order>
  <A11y.Index
    index={1}
    onScreenReaderSubViewFocused={() => setHighlighted('alpha')}
    onScreenReaderSubViewBlurred={() => setHighlighted(null)}
  >
    <View accessible accessibilityLabel="Alpha">
      <Text>α</Text>
    </View>
  </A11y.Index>
</A11y.Order>
```

## A11y.View vs A11y.Index

Use `A11y.View` when you only need focus events or iOS container semantics — no ordering
required. Use `A11y.Index` when the element must also participate in a screen-reader focus
sequence. `A11y.View` accepts the same events as `A11y.Index` minus `index`.

## Related

- [Screen-reader focus order](./a11y-order.md)
- [Component overview → A11y.View](../components/overview.md#a11yview)

---

← [Announcements](./announcements.md) · [iOS semantic containers →](./a11y-ui-container.md)
