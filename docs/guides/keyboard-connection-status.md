# Connection & runtime status

> **`useIsKeyboardConnected` is new in the merged package.**

Two pairs of hooks report assistive-technology status at runtime and update live as it
changes:

- **`useIsKeyboardConnected`** — is a physical (external / hardware) keyboard connected?
- **`useIsScreenReaderEnabled`** — is VoiceOver / TalkBack enabled?

Each has a **ref variant** (`…Ref`) that holds the latest value without triggering a
re-render. Use these to adapt the UI — show keyboard hints only when a keyboard is
attached, or tailor copy when a screen reader is active.

<!-- TODO: capture combined-package demo (status-ios.gif) -->
<img src="../images/status-ios.gif" height="400" alt="Live status hooks on iOS" />

## `useIsKeyboardConnected`

```tsx
import { useIsKeyboardConnected } from 'react-native-a11y';

function KeyboardHint() {
  const isConnected = useIsKeyboardConnected();
  if (!isConnected) return null;
  return <Text>Press Tab to move between fields.</Text>;
}
```

- Queries the current state on mount, then updates live via the keyboard-status event.
- Re-renders the component whenever the connection status flips.

### Signature

```ts
function useIsKeyboardConnected(ignoreWarn?: boolean): boolean;
```

| Param | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `ignoreWarn` | `boolean` | `false` | Suppress the console error logged on iOS if the GameController framework is unavailable. |

> [!NOTE]
> On iOS, keyboard-connection detection relies on the GameController framework. It is
> linked automatically through the package's podspec — no manual Xcode setup needed. In
> the rare case it's unavailable, the hook logs an error once on mount and reports
> `false`; pass `useIsKeyboardConnected(true)` to silence that error.

## `useIsScreenReaderEnabled`

```tsx
import { useIsScreenReaderEnabled } from 'react-native-a11y';

function Banner() {
  const srEnabled = useIsScreenReaderEnabled();
  return <Text>{srEnabled ? 'Screen reader on' : 'Screen reader off'}</Text>;
}
```

Backed by React Native's `AccessibilityInfo` — no native module required. Queries the
current state on mount and updates via the `screenReaderChanged` event.

```ts
function useIsScreenReaderEnabled(): boolean;
```

## Ref variants — `useIsKeyboardConnectedRef` / `useIsScreenReaderEnabledRef`

When you only need the value inside a callback or effect (not for rendering), the ref
variants avoid re-renders. `ref.current` always holds the latest value.

```tsx
import { useIsKeyboardConnectedRef } from 'react-native-a11y';

function Form() {
  const keyboardRef = useIsKeyboardConnectedRef();

  const onSubmit = () => {
    if (keyboardRef.current) {
      // hardware keyboard attached — keep focus on the next field
    }
  };
}
```

| Hook | Returns | Re-renders on change |
| :-- | :-- | :-- |
| `useIsKeyboardConnected(ignoreWarn?)` | `boolean` | Yes |
| `useIsKeyboardConnectedRef(ignoreWarn?)` | `MutableRefObject<boolean>` | No |
| `useIsScreenReaderEnabled()` | `boolean` | Yes |
| `useIsScreenReaderEnabledRef()` | `MutableRefObject<boolean>` | No |

## Imperative / non-hook access

Outside React components, use the underlying functions and listeners:

| Function | Description |
| :-- | :-- |
| `isKeyboardConnected()` | `Promise<boolean>` — current keyboard connection state. |
| `keyboardStatusListener(cb)` | Subscribe to keyboard connect/disconnect. Returns an unsubscribe function. `cb` receives `{ status: boolean }`. |
| `isScreenReaderEnabled()` | `Promise<boolean>` — current screen-reader state. |
| `screenReaderStatusListener(cb)` | Subscribe to screen-reader enable/disable. Returns an unsubscribe function. `cb` receives `{ status: boolean }`. |

```tsx
import { keyboardStatusListener } from 'react-native-a11y';

const unsubscribe = keyboardStatusListener(({ status }) => {
  console.log('keyboard connected:', status);
});
// later: unsubscribe();
```

## Putting both together

```tsx
import {
  useIsKeyboardConnected,
  useIsScreenReaderEnabled,
} from 'react-native-a11y';

function StatusBar() {
  const screenReader = useIsScreenReaderEnabled();
  const keyboard = useIsKeyboardConnected();
  return (
    <View>
      <Text>Screen reader: {screenReader ? 'on' : 'off'}</Text>
      <Text>Keyboard: {keyboard ? 'connected' : 'disconnected'}</Text>
    </View>
  );
}
```

## Related

- [API reference → Hooks](../api/overview.md#hooks)
- [Getting started](../getting-started/getting-started.md)

---

← [Optimistic accessibility values](./optimistic-state.md) · [Component overview →](../components/overview.md)
