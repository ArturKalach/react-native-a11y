# `withKeyboardFocus` — which declaration is most efficient?

`A11y.Pressable`, `A11y.View`, and anything wrapped in
[`withKeyboardFocus`](../components/overview.md#withkeyboardfocus) can be told about
focus/press in several different ways. They all *work*, but they differ in re-render
cost and in what they let you express. See
[Pressable focus handling](./pressable-focus.md) for the full API reference of each
prop used below.

> [!NOTE]
> **For the classic "border/background ring that reacts to focus and press" use
> case, `style` and `containerStyle` (function form) are the right, directly-supported
> tool — reach for them first.** They are not a "slower fallback"; on the host
> re-render cost they're on par with the render-prop patterns. The zero-re-render
> context-leaf pattern (tier **S**) is a narrower, opt-in optimization for large
> lists/grids, not a general replacement for `style`/`containerStyle`.

> [!NOTE]
> "Host" means the `A11yView` that backs the component — the thing that carries the
> native focus halo and hosts the wrapped touchable. A host re-render also re-renders
> everything inside it (unless a child is independently memoized).

## Rating table

| Tier | Approach | Re-renders host on | Best for |
| :--: | :-- | :-- | :-- |
| **S** | Fully static (no reactive props) | Never | No JS-visible state needed — native halo only |
| **S** | Context leaf (`useIsViewFocused` + `useIsViewPressed`) | Never | Large lists/grids — the only pattern with zero host re-renders on *both* focus and press |
| **A** | Function `style` | Focus, + Android keyboard press (not touch) | **The default** for styling the pressable surface itself (border, background, opacity) |
| **A** | `renderContent` | Focus, + Android keyboard press (not touch) | Same cost as `style` — use when you need to change *content*, not just style, based on focus/press |
| **A** | Function `children` (no `renderContent`) | Never (no `focused` available) | Cheapest way to react to `pressed` alone when you don't need `focused` |
| **B** | Function `containerStyle` | Focus, Android keyboard press, **and every touch press-in/out** | Styling the *outer* container/ring specifically — slightly pricier because touch press isn't otherwise visible at that layer |
| **D** | `focusStyle` / `containerFocusStyle` / `withPressedStyle` (deprecated) | Focus only; press needs manual wiring | Never in new code — migrate to `style`/`containerStyle` |

---

## A — Function `style` (the default)

The idiomatic, most common pattern, and the right tool for a focus/press ring on the
pressable surface itself:

```tsx
<A11y.Pressable
  style={({ focused, pressed }) => [
    styles.card,
    focused && styles.focused,
    pressed && styles.pressed,
  ]}
  onPress={onPress}
>
  <Text>Item</Text>
</A11y.Pressable>
```

**Re-render cost, precisely:** the host re-renders when *focus* changes (it has to —
`focused` is real state), and on Android when a *physical keyboard* press fires (the
library auto-tracks that so keyboard activation styles the same as touch). A plain
**touch** press does **not** re-render the host: RN's own `Pressable` invokes your
`style` callback directly from its own internal touch state, re-rendering only its own
subtree.

**Use for:** the standard case — a button, row, or card whose background/border should
react to focus and press. This is correct on touch + keyboard, on both platforms,
always — no heuristics to reason about on your end.

---

## A — `renderContent`

Same re-render cost as `style` above (it also needs `focused`, so it also sets the host
to react to focus), but lets you change what's *rendered*, not just how it's styled:

```tsx
<A11y.Pressable
  style={styles.card}
  renderContent={({ focused, pressed }) => (
    <Icon name={pressed ? 'heart-filled' : focused ? 'heart-outline-tinted' : 'heart-outline'} />
  )}
/>
```

**Use for:** conditional content (swap an icon, change text) driven by focus/press.
Don't reach for this as a "faster `style`" — it isn't; it's for a different job.

---

## A — Function `children` (no `renderContent`)

Native `Pressable` render-prop children, without going through `renderContent`. This is
the one pattern that never re-renders the host at all — because it doesn't ask for
`focused`, the host never needs to track focus as state:

```tsx
<A11y.Pressable style={styles.card}>
  {({ pressed }) => <Text style={pressed && styles.pressed}>Item</Text>}
</A11y.Pressable>
```

**Use for:** press-only content changes where you don't need `focused`. If you need
`focused` too, use `renderContent` (content changes) or `style`/`containerStyle`
(styling) instead — both cost the same one extra re-render on focus.

---

## S — Context leaf (`useIsViewFocused` + `useIsViewPressed`)

Keep the `A11y.Pressable` itself fully static, and read state from a small child via
context. Only that child re-renders — the host, the native halo, and everything else in
the tree stay untouched, on **both** focus and press, on **both** platforms:

```tsx
const Label = () => {
  const focused = useIsViewFocused();
  const pressed = useIsViewPressed();
  return (
    <Text style={[styles.label, focused && styles.focused, pressed && styles.pressed]}>
      Item
    </Text>
  );
};

<A11y.Pressable style={styles.card} onPress={onPress}>
  <Label />
</A11y.Pressable>
```

This is the only pattern with **zero** host re-renders on both focus and press, on
every platform, unconditionally — `useIsViewPressed` is fed from the same
`handlePressIn`/`handlePressOut` calls that drive every other press path, so it's
correct without relying on any auto-enable heuristic.

**Use for:** long lists or dense grids where per-item re-render cost is measurable —
not as a default for a handful of buttons. It also requires restructuring your content
into a child that reads context, which is more code for a single button than just
writing `style={({ focused, pressed }) => ...}`.

---

## B — Function `containerStyle`

Styles the *outer* container instead of the inner touchable — useful when the ring
needs to sit on the wrapping container's own edge (e.g. a card whose focus ring must
outline the whole card, not just an inner button):

```tsx
<A11y.Pressable
  style={styles.card}
  containerStyle={({ focused, pressed }) => [
    styles.ring,
    focused && styles.ringFocused,
    pressed && styles.ringPressed,
  ]}
  onPress={onPress}
>
  <Text>Item</Text>
</A11y.Pressable>
```

**Why it costs slightly more than `style`:** the outer container isn't the thing RN's
`Pressable` tracks touch state for — so, to give `containerStyle` a `pressed` value,
the library has to track *touch* press explicitly as host state too. That means the
host re-renders on every touch press-in/out, not just on focus + keyboard press.

**Use for:** exactly what it's for — styling the outer container/ring. It's still the
right, direct tool for that job; the extra touch-tracking cost only matters if you're
rendering many instances (in which case, prefer the **S** context-leaf pattern with a
static `containerStyle` and an overlay child instead).

---

## D — `focusStyle` / `containerFocusStyle` / `withPressedStyle` (deprecated)

The pre-unification API. `focusStyle`/`containerFocusStyle` re-render the host on focus
only (a static style/callback receiving `{ focused }`, no `pressed`); `withPressedStyle`
was the old opt-in flag for press-reactive styles, before that became automatic.

```tsx
// deprecated — migrate to style={({ focused, pressed }) => ...}
<A11y.Pressable focusStyle={styles.focused} onPress={onPress}>
  <Text>Item</Text>
</A11y.Pressable>
```

**Use when:** never in new code. These props are marked `@deprecated` in the type
definitions and may be removed in a future major version — migrate to `style`/
`containerStyle` (tier **A**/**B**) or, for perf-sensitive spots, the context-leaf
pattern (tier **S**).

---

## Quick decision guide

- **Styling the pressable surface on focus/press (the common case)?** → `style` (A).
- **Need to change content, not just style, on focus/press?** → `renderContent` (A).
- **Only need `pressed`, not `focused`?** → function `children` (A) — cheapest option.
- **Styling the outer container/ring specifically?** → `containerStyle` (B) — the right
  tool for the job, slightly pricier due to touch tracking.
- **Rendering a long list/grid and profiling shows re-render cost matters?** → context
  leaf (S).
- **Touching old code with `focusStyle`/`withPressedStyle`?** → migrate off D.
