# Focus lock — trap focus in modals & overlays

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (focus-lock-ios.gif) --> <img src="../images/focus-lock-ios.gif" height="400" alt="Focus trap on iOS" /> | <!-- TODO: capture combined-package demo (focus-lock-android.gif) --> <img src="../images/focus-lock-android.gif" height="400" alt="Focus trap on Android" /> |

`A11y.FocusTrap` and `A11y.FocusFrame` confine focus to a region. Use them for modals,
bottom sheets, confirmation dialogs, and any overlay where focus must not leak to content
behind.

> [!IMPORTANT]
> In the merged package the trap is **unified**: a single `A11y.FocusTrap` /
> `A11y.FocusFrame` confines **both** screen-reader focus and physical-keyboard focus.
> You no longer choose between a screen-reader trap and a keyboard trap — they are the
> same component.

## Components

- **`A11y.FocusFrame`** — place at the root of the screen or overlay. It provides the
  boundary context that `A11y.FocusTrap` relies on. **Always required** —
  `A11y.FocusTrap` must be a descendant of `A11y.FocusFrame`.
- **`A11y.FocusTrap`** — wraps the content that should hold focus. Only one `FocusTrap`
  should be active inside a `FocusFrame` at a time.

## Platform behavior

**iOS**: `A11y.FocusTrap` sets `accessibilityViewIsModal = true` on the wrapping view.
With `forceLock`, it also actively redirects VoiceOver back into the trap when focus
escapes — focus is corrected reactively, so VoiceOver may briefly jump outside the trap
before being returned.

**Android**: where no `accessibilityViewIsModal` equivalent exists, the trap intercepts
TalkBack navigation gestures to keep focus within the defined boundary.

## Basic usage

```tsx
import { A11y } from 'react-native-a11y';

<A11y.FocusFrame style={{ flex: 1 }}>
  <MainContent />

  {isModalVisible && (
    <A11y.FocusTrap>
      <Text accessibilityRole="header">Confirm action</Text>
      <Button title="Confirm" onPress={confirm} />
      <Button title="Cancel" onPress={dismiss} />
    </A11y.FocusTrap>
  )}
</A11y.FocusFrame>
```

When `isModalVisible` is `true`, focus cannot move to `MainContent` until the trap is
dismissed.

## forceLock

Use `forceLock` when `accessibilityViewIsModal` alone is not enough to prevent focus from
escaping. This is common with programmatically-opened modals or complex overlays.

```tsx
<A11y.FocusTrap forceLock>
  <Text accessibilityRole="header">Modal Title</Text>
  <Button title="Close" onPress={onClose} />
</A11y.FocusTrap>
```

`forceLock` actively redirects focus back into the trap when it escapes. Use it when you
notice focus jumping outside the modal.

## Disabling the trap

Set `lockDisabled` to temporarily release the focus constraint without unmounting:

```tsx
<A11y.FocusTrap lockDisabled={isDeactivated}>
  {children}
</A11y.FocusTrap>
```

## A11y.FocusTrap props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `lockDisabled` | `boolean` | `false` | When `true`, the focus trap is inactive and focus can leave freely. |
| `forceLock` | `boolean` | `false` | Actively redirects focus back into the trap when it escapes (strengthens iOS `accessibilityViewIsModal`; moves focus inside on mount). |
| `...ViewProps` | — | — | All standard React Native View props. |

## A11y.FocusFrame props

`A11y.FocusFrame` accepts all standard React Native `ViewProps`. No additional props.

## Common pattern: modal with screen-change announcement

```tsx
const Modal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  if (!visible) return null;
  return (
    <A11y.FocusTrap forceLock style={styles.modal}>
      <A11y.ScreenChange title="Confirmation dialog" />
      <Text accessibilityRole="header">Are you sure?</Text>
      <Button title="Confirm" onPress={onClose} />
      <Button title="Cancel" onPress={onClose} />
    </A11y.FocusTrap>
  );
};

export const ScreenWithModal = () => (
  <A11y.FocusFrame style={{ flex: 1 }}>
    <ScreenContent />
    <Modal visible={showModal} onClose={() => setShowModal(false)} />
  </A11y.FocusFrame>
);
```

## Related

- [Announcements](./announcements.md) — `A11y.PaneTitle` / `A11y.ScreenChange`
- [Keyboard focus order → direction locking](./focus-order.md#3-direction-locking)

---

← [Cards with inner buttons](./a11y-card.md) · [Screen-reader focus events →](./focus-events.md)
