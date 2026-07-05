# Migration Guide

`react-native-a11y` re-merges `react-native-a11y-order` and
`react-native-external-keyboard` into one package under a single `A11y.*` namespace. There
are four ways to arrive here — pick the section that matches where you're coming from.

- [From 0.8.0 to 0.9.0](#from-080-to-090)
- [From legacy `react-native-a11y` 0.7](#from-legacy-react-native-a11y-07)
- [From `react-native-a11y-order`](#from-react-native-a11y-order)
- [From `react-native-external-keyboard`](#from-react-native-external-keyboard)

> [!IMPORTANT]
> The three packages stay published and are **mutually exclusive** — install exactly one.
> `react-native-a11y` is self-contained; remove `react-native-a11y-order` /
> `react-native-external-keyboard` if you switch to it.

---

## From 0.8.0 to 0.9.0

0.9.0 reworks the `withKeyboardFocus` style/press pipeline (`A11y.View` / `A11y.Pressable` /
`A11y.Input` all go through it) and simplifies the iOS halo. Nothing in this section requires
changes to keep working — the old props still compile — but the notes below tell you what's
now deprecated, what's auto-enabled, and the one place a raw-context consumer needs an update.

### `style` / `containerStyle` unify with `focusStyle` / `containerFocusStyle`

`style` and `containerStyle` now each accept a callback that receives the current
`InteractionState` — `{ focused, pressed }` — instead of only a static style. This replaces
the separate `focusStyle` / `containerFocusStyle` props, which are now **deprecated** (still
work, no timeline for removal yet).

| 0.8 | 0.9 |
| :-- | :-- |
| `focusStyle={{ backgroundColor: 'dodgerblue' }}` | `style={({ focused }) => focused && { backgroundColor: 'dodgerblue' }}` |
| `containerFocusStyle={{ borderColor: 'dodgerblue' }}` | `containerStyle={({ focused }) => focused && { borderColor: 'dodgerblue' }}` |
| `focusStyle={({ focused }) => ...}` | `style={({ focused, pressed }) => ...}` (now also gets `pressed`) |

```tsx
// Before (0.8)
<A11y.Pressable
  style={styles.button}
  focusStyle={{ backgroundColor: 'dodgerblue' }}
  containerStyle={styles.container}
  containerFocusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  onPress={onPress}
>
  <Text>Item</Text>
</A11y.Pressable>

// After (0.9)
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
  <Text>Item</Text>
</A11y.Pressable>
```

Static styles (no callback) work unchanged on both `style` and `containerStyle` — you only
need to touch call sites that used `focusStyle` / `containerFocusStyle`.

See [Pressable focus handling](../guides/pressable-focus.md) and
[Focus styling](../guides/focus-styling.md) for the full guide, and the new
[withKeyboardFocus re-render guide](../guides/withKeyboardHandler.md) for the cost of each
declaration style.

### `withPressedStyle` and `androidKeyboardPressState` are now automatic

- `withPressedStyle` is **deprecated** — the pressed-style handling it used to gate on now
  turns on automatically whenever `style` (or `containerStyle`) is a function. You can delete
  `withPressedStyle` from custom `withKeyboardFocus`-wrapped components.
- `androidKeyboardPressState` (Android-only; makes physical-keyboard activation report
  `pressed` the same way touch does) now **auto-enables** whenever a pressed-reactive style or
  render prop is present (`style`/`containerStyle` as a function, `renderContent`, or a
  function `children`). An explicit `true`/`false` still overrides the auto-detection.

If you were setting either prop by hand purely to make keyboard press styling work, it's safe
to remove it.

### New: `useIsViewPressed()`

A press-state counterpart to `useIsViewFocused()`, backed by a new `IsViewPressedContext`.
It reflects touch **and** physical-keyboard press, on both platforms, and lets a descendant
react to press without re-rendering the focusable host itself:

```tsx
import { A11y, useIsViewPressed } from 'react-native-a11y';

const Label = () => {
  const pressed = useIsViewPressed();
  return <Text style={pressed && styles.pressed}>Item</Text>;
};

<A11y.Pressable onPress={onPress}>
  <Label />
</A11y.Pressable>;
```

### Breaking (edge case): `IsViewFocusedContext`'s raw value changed shape

If you call `useIsViewFocused()`, nothing changes — it still returns a `boolean`. But if any
code reads `IsViewFocusedContext` directly with `useContext(IsViewFocusedContext)` (bypassing
the hook), the context value changed from a plain `boolean` to a `FocusStore | null` (an
object with `subscribe`/`getSnapshot`, used internally so focus updates skip re-rendering the
host). Switch any direct `useContext(IsViewFocusedContext)` call to `useIsViewFocused()`.

### iOS halo: `roundedHaloFix` is now fully unnecessary

A disabled halo (`haloEffect={false}` or `tintType="none"`) now **always** stays disabled on
rounded views — the halo is computed fresh from props on every focus query instead of being
re-armed off the view's live `layer.cornerRadius`. `roundedHaloFix` is a no-op; delete it from
any component that still passes it. Keep rounding the **view** via `containerStyle`
(`borderRadius`) and, if you want the halo ring itself rounded to match, set
`haloCornerRadius` to the same value — the halo doesn't infer its radius from the view's
style. See [Focus styling § Shaping the halo](../guides/focus-styling.md#shaping-the-halo).

### Bug fixes (no action needed)

- **iOS halo props on recycled Fabric views** — a view recycled by Fabric for a new component
  with an *unchanged* halo prop (e.g. same `haloCornerRadius`) could get stuck with a
  previously-reset value instead of the real one. Fixed by comparing against live instance
  state rather than the previous props snapshot.
- **`A11y.Card` touch / drag screen-reader exploration** — an iOS `accessibilityElements`
  override on the card's overlay view was interfering with touch-exploration ("drag to
  discover") over the card's children. Removed; card content is discoverable via touch again.

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
| `KeyboardFocusView` / `KeyboardExtendedView` | `A11y.View` (+ own focus state) or `A11y.Pressable` | `A11yKeyboardFocusView` + both old names *(deprecated)* |
| `BaseKeyboardView` / `ExternalKeyboardView` / `KeyboardExtendedBaseView` | `A11y.View` | all three names *(deprecated)* |
| `KeyboardFocusGroup` | `A11y.FocusGroup` | `KeyboardFocusGroup` *(deprecated)* |
| `KeyboardExtendedInput` / `KeyboardFocusTextInput` | `A11y.Input` | both names *(deprecated)* |
| `KeyboardExtendedPressable` | `A11y.Pressable` | `KeyboardExtendedPressable` *(deprecated)* |
| `withKeyboardFocus` | `withKeyboardFocus` | unchanged |
| `KeyboardOrderFocusGroup` | `KeyboardOrderFocusGroup` | unchanged |
| `Keyboard` | `Keyboard` | unchanged |

> [!NOTE]
> The standalone component names above are re-exported by `react-native-a11y` as
> deprecated aliases, so most code compiles after just swapping the package name and
> import path. `KeyboardFocusView` / `KeyboardExtendedView` keep their full behavior —
> `focusStyle`, `onPress` / `onLongPress`, `triggerCodes`, and `useIsViewFocused` — via
> the kept `A11yKeyboardFocusView` component (the others are thin aliases of `A11y.View`).
> The bare `Pressable` / `TextInput` exports from `react-native-external-keyboard` are
> **not** re-exported (they shadow React Native's own components) — switch those to
> `A11y.Pressable` / `A11y.Input` (or `KeyboardExtendedPressable` /
> `KeyboardExtendedInput`).

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
