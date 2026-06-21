# Optimistic accessibility values

> **New in the merged package · iOS only.**

When an action changes a control's value, iOS VoiceOver reads the element's
`accessibilityValue` / state **the instant the action fires** — before React re-renders.
Without help, it announces the *previous* value. The `optimistic` prop feeds the
*predicted next* value so VoiceOver speaks the right thing immediately, for the brief
window between the action and the next props update.

<!-- TODO: capture combined-package demo (optimistic-ios.gif) -->
<img src="../images/optimistic-ios.gif" height="400" alt="Optimistic announcements on iOS" />

> [!NOTE]
> This is iOS-only. On Android the prop is a no-op — the controls still work, nothing is
> announced optimistically.

## The problem

Consider a checkbox whose `accessibilityState.checked` is driven by React state. When the
user double-taps:

1. VoiceOver triggers the activation and **immediately reads** the current
   `accessibilityState` — still `unchecked`.
2. Your `onPress` updates state; React re-renders to `checked` a frame (or several) later.

The result: VoiceOver says "unchecked" even though the user just checked it. A simulated
loading delay makes the gap wider and the stale read obvious.

## The fix

Pass `optimistic` with the value you *expect* after the action. VoiceOver announces that
prediction right away.

```tsx
import { A11y } from 'react-native-a11y';

const [checked, setChecked] = useState(false);

<A11y.Pressable
  accessibilityRole="checkbox"
  accessibilityLabel="Email notifications"
  accessibilityState={{ checked }}
  optimistic={{ state: !checked }} // predicted next checked value
  onPress={() => setChecked((c) => !c)}
>
  {/* …checkbox UI… */}
</A11y.Pressable>
```

## Config fields — `A11yOptimisticConfig`

Each field is a static snapshot taken at action time. Omitting the whole object disables
the behavior.

| Field | Type | Announced when |
| :-- | :-- | :-- |
| `state` | `boolean` | On activate (double-tap) for toggles. Announced role-aware — checkbox/radio → "checked"/"unchecked", switch → "on"/"off". |
| `activate` | `string` | On activate (double-tap). An explicit string; **takes precedence over `state`**. |
| `increase` | `string` | After VoiceOver triggers increment (swipe up on an adjustable). |
| `decrease` | `string` | After VoiceOver triggers decrement (swipe down on an adjustable). |

```ts
type A11yOptimisticConfig = {
  increase?: string;
  decrease?: string;
  activate?: string;
  state?: boolean;
};
```

### `state` — role-aware toggle (switch)

```tsx
<A11y.Pressable
  accessibilityRole="switch"
  accessibilityLabel="Wi-Fi"
  accessibilityState={{ checked: enabled }}
  optimistic={{ state: !enabled }} // announced "on" / "off" for switch role
  onPress={() => setEnabled((e) => !e)}
>
  {/* …switch UI… */}
</A11y.Pressable>
```

### `activate` — explicit string on a cycling value

```tsx
const next = (priority + 1) % PRIORITIES.length;

<A11y.Pressable
  accessibilityRole="button"
  accessibilityLabel="Priority"
  accessibilityValue={{ text: PRIORITIES[priority] }}
  optimistic={{ activate: PRIORITIES[next] }}
  onPress={() => setPriority(next)}
>
  {/* …value pill… */}
</A11y.Pressable>
```

### `increase` / `decrease` — adjustable

```tsx
<A11y.Pressable
  accessibilityRole="adjustable"
  accessibilityLabel="Quantity"
  accessibilityValue={{ text: String(quantity) }}
  accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
  onAccessibilityAction={handleAdjust}
  optimistic={{
    increase: String(quantity + 1),
    decrease: String(Math.max(0, quantity - 1)),
  }}
>
  {/* …quantity UI… */}
</A11y.Pressable>
```

> [!IMPORTANT]
> `increase` / `decrease` only change what is **announced** — the element must still
> carry the Adjustable trait (`accessibilityRole="adjustable"`) and real
> `accessibilityActions` to actually step the value.

## How targeting works

The optimistic value follows the same targeting as `screenReaderFocusTarget` /
`focusableWrapper`:

- On a plain `A11y.View` in `self` mode, the prediction applies to the view itself.
- On `A11y.Pressable` and `A11y.Input`, which wrap their inner component in a focusable
  `A11y.View`, the config is applied in wrapper mode — the inner focused element looks up
  its `A11y.View` host for the optimistic value. This is why the examples above put
  `optimistic` directly on `A11y.Pressable`.

## Related

- [Component overview → common focus props](../components/overview.md#common-focus-props)
- [Announcements](./announcements.md) — for one-off messages not tied to a control's value

---

← [Announcements](./announcements.md) · [Connection & runtime status →](./keyboard-connection-status.md)
