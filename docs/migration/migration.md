# Migration Guide

`react-native-a11y` re-merges `react-native-a11y-order` and
`react-native-external-keyboard` into one package under a single `A11y.*` namespace. There
are three ways to arrive here — pick the section that matches where you're coming from.

- [From legacy `react-native-a11y` 0.7](#from-legacy-react-native-a11y-07)
- [From `react-native-a11y-order`](#from-react-native-a11y-order)
- [From `react-native-external-keyboard`](#from-react-native-external-keyboard)

> [!IMPORTANT]
> The three packages stay published and are **mutually exclusive** — install exactly one.
> `react-native-a11y` is self-contained; remove `react-native-a11y-order` /
> `react-native-external-keyboard` if you switch to it.

---

## From legacy `react-native-a11y` 0.7

The legacy 0.7 package was an all-in-one library built around an `A11yModule` native
bridge, an `A11yProvider`, and imperative focus-order hooks. The rebuilt package keeps the
same capabilities but exposes them through the unified `A11y.*` namespace, with the old
imperative focus-order API preserved under a `Legacy.*` shim.

### Components

| 0.7 | New | Notes |
| :-- | :-- | :-- |
| `KeyboardFocusView` | `A11y.View` | Unified focusable view (SR + keyboard props, opt-in). |
| `Pressable` | `A11y.Pressable` | Keyboard- + SR-focusable pressable. |
| `KeyboardFocusTextInput` | `A11y.Input` | Kept as a deprecated alias (`KeyboardFocusTextInput`) too. |
| `PaneView` | `A11y.PaneTitle` / `A11y.ScreenChange` | Screen / panel announcements. |
| `A11yOrder` (+ `useFocusOrder`) | `Legacy.A11yOrder` (+ `Legacy.useFocusOrder`) | Imperative order moved under `Legacy.*`; for new code prefer declarative `A11y.Order` / `A11y.Index`. |

### Imperative module → namespaced APIs

The `A11yModule.*` methods are replaced by top-level functions and the `Legacy.*` shim.

| 0.7 (`A11yModule.*`) | New |
| :-- | :-- |
| `announceForAccessibility(msg)` | `announce(msg)` |
| `announceScreenChange(msg)` | `<A11y.ScreenChange title={msg} />` (or `ScreenReader.announce`) |
| `isKeyboardConnected()` | `isKeyboardConnected()` (top-level) |
| `keyboardStatusListener(cb)` | `keyboardStatusListener(cb)` (top-level) |
| `setA11yFocus(ref)` | `Legacy.setAccessibilityFocus(tag)` *(tag-based — wrap with `findNodeHandle`)* |
| `setKeyboardFocus(ref)` | `Legacy.setKeyboardFocus(tag)` |
| `setPreferredKeyboardFocus(tag)` | `Legacy.setPreferredKeyboardFocus(tag)` |

```tsx
// Before (0.7)
import { A11yModule } from 'react-native-a11y';
A11yModule.announceForAccessibility('Saved');
A11yModule.setKeyboardFocus(ref);

// After
import { announce, Legacy } from 'react-native-a11y';
import { findNodeHandle } from 'react-native';
announce('Saved');
const tag = findNodeHandle(ref.current);
if (tag) Legacy.setKeyboardFocus(tag);
```

### Hooks

| 0.7 | New |
| :-- | :-- |
| `useFocusOrder(count)` | `Legacy.useFocusOrder(count)` |
| `useDynamicFocusOrder()` | `Legacy.useDynamicFocusOrder()` |
| `useKeyboardConnected()` | `useIsKeyboardConnected()` |
| `useA11yEnabled()` | `useIsScreenReaderEnabled()` |
| `useCombinedRef` | `Legacy.useCombinedRef` (or top-level `combineRefs`) |

```tsx
// Before (0.7)
import { useFocusOrder } from 'react-native-a11y';
const { a11yOrder, refs } = useFocusOrder(2);

// After — one-line find/replace to the Legacy shim
import { Legacy } from 'react-native-a11y';
const { a11yOrder, refs } = Legacy.useFocusOrder(2);
```

See the [Legacy API reference](../api/legacy.md) for the full `Legacy.*` surface.

### Provider

`A11yProvider` is still exported and continues to work — no change required. Its internal
composition differs, but the public contract is preserved.

### Focus-target prop values

The legacy `orderType` values describing *which element* gets screen-reader focus moved to
the dedicated `screenReaderFocusTarget` prop:

| 0.7 `orderType` | New `screenReaderFocusTarget` |
| :-- | :-- |
| `'default'` | `'self'` |
| `'child'` | `'child'` |
| `'subview'` | `'firstAccessible'` |

The `orderType` prop now selects the **engine** (`'auto' | 'keyboard' |
'screen-reader'`), not the focus target.

---

## From `react-native-a11y-order`

This is the smallest move — the `A11y.*` component names are unchanged, so most code is a
**package swap**.

### 1. Swap the dependency

```sh
yarn remove react-native-a11y-order
yarn add react-native-a11y
cd ios && pod install && cd ..
```

### 2. Update imports

```tsx
// Before
import { A11y, announce, ScreenReader } from 'react-native-a11y-order';

// After
import { A11y, announce, ScreenReader } from 'react-native-a11y';
```

`A11y.Order`, `A11y.Index`, `A11y.View`, `A11y.Card`, `A11y.FocusTrap`, `A11y.FocusFrame`,
`A11y.PaneTitle`, `A11y.ScreenChange`, and the `announce` / `ScreenReader` APIs all behave
the same.

### 3. Rename the focus-target prop

The one rename: `A11y.Index` / `A11y.View`'s `orderType` (which chose *which element* got
focus) is now `screenReaderFocusTarget`, and its values changed.

| `react-native-a11y-order` `orderType` | New `screenReaderFocusTarget` |
| :-- | :-- |
| `'default'` | `'self'` |
| `'child'` | `'child'` |
| `'subview'` | `'firstAccessible'` |

```tsx
// Before
<A11y.Index index={1} orderType="subview">…</A11y.Index>

// After
<A11y.Index index={1} screenReaderFocusTarget="firstAccessible">…</A11y.Index>
```

> [!NOTE]
> The name `orderType` still exists on the merged component, but it now means the
> *ordering engine* (`'auto' | 'keyboard' | 'screen-reader'`), defaulting to `'auto'`.
> Leaving it unset keeps screen-reader ordering working as before — just move your old
> `orderType` value to `screenReaderFocusTarget`.

### What's new for you

Because you now have the keyboard half too, `A11y.View` / `A11y.Pressable` / `A11y.Input`
accept the [keyboard focus props](../guides/focus-order.md), and you gain
[`useIsKeyboardConnected`](../guides/keyboard-connection-status.md) and
[optimistic values](../guides/optimistic-state.md). None of this is required.

---

## From `react-native-external-keyboard`

The keyboard components keep working through deprecated aliases, but the canonical names
are now the `A11y.*` ones. Also fold in the 0.9.1 → 1.0 prop/type renames if you're coming
from an older `react-native-external-keyboard`.

### 1. Swap the dependency

```sh
yarn remove react-native-external-keyboard
yarn add react-native-a11y
cd ios && pod install && cd ..
```

### 2. Move to the `A11y.*` names

The old namespaces remain as **deprecated aliases**, so existing code compiles — but
migrate to the canonical names:

| `react-native-external-keyboard` | New canonical | Still available as |
| :-- | :-- | :-- |
| `K.View` | `A11y.View` | `K.View` *(deprecated)* |
| `K.Pressable` | `A11y.Pressable` | `K.Pressable` *(deprecated)* |
| `K.Input` | `A11y.Input` | `K.Input` *(deprecated)* |
| `Focus.Frame` | `A11y.FocusFrame` | `Focus.Frame` *(deprecated)* |
| `Focus.Trap` | `A11y.FocusTrap` | `Focus.Trap` *(deprecated)* |
| `KeyboardExtendedInput` / `KeyboardFocusTextInput` | `A11y.Input` | `KeyboardFocusTextInput` *(deprecated)* |
| `withKeyboardFocus` | `withKeyboardFocus` | unchanged |
| `KeyboardOrderFocusGroup` | `KeyboardOrderFocusGroup` | unchanged |
| `Keyboard` | `Keyboard` | unchanged |

```tsx
// Before
import { K, Focus } from 'react-native-external-keyboard';
<K.Pressable onPress={onPress} />
<Focus.Trap forceLock>…</Focus.Trap>

// After
import { A11y } from 'react-native-a11y';
<A11y.Pressable onPress={onPress} />
<A11y.FocusTrap forceLock>…</A11y.FocusTrap>
```

> [!NOTE]
> `A11y.FocusTrap` / `A11y.FocusFrame` are now **unified** — they confine screen-reader
> **and** keyboard focus together. The `forceLock` / `lockDisabled` props carry over. See
> [Focus lock](../guides/focus-lock.md).

### 3. Carry over the 0.9.1 → 1.0 renames

If your project is still on a pre-1.0 `react-native-external-keyboard`, apply these
renames too (unchanged by the merge):

| Old prop | New prop |
| :-- | :-- |
| `group` | `focusableWrapper` |
| `canBeFocused` | `focusable` |
| `viewRef` *(HOC)* | `componentRef` |

Removed props: `enableA11yFocus` (no-op; use `screenAutoA11yFocus` or
`ref.screenReaderFocus()`), `ignoreGroupFocusHint`, `FocusHoverComponent` (use
`renderContent` / `renderFocusable` or `focusStyle`), `exposeMethods` (the ref proxies
native methods automatically).

Renamed types: `KeyboardExtendedViewType` → `BaseKeyboardViewType`, `WithKeyboardFocus` →
`KeyboardFocusableComponent`.

```tsx
// Before
<KeyboardExtendedView group canBeFocused={isEnabled}>…</KeyboardExtendedView>

// After
<A11y.View focusableWrapper focusable={isEnabled}>…</A11y.View>
```

### What's new for you

You now also have the screen-reader half: [`A11y.Order` / `A11y.Index`](../guides/a11y-order.md),
[`A11y.Card`](../guides/a11y-card.md), [announcements](../guides/announcements.md), and
[iOS semantic containers](../guides/a11y-ui-container.md) — plus
[optimistic values](../guides/optimistic-state.md). All additive.

---

← [API reference](../api/overview.md) · [Docs home](../README.md)
