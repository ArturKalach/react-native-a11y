# CLAUDE.md — Halo feature (iOS)

The **keyboard focus halo**: the ring UIKit draws around the focused view during
physical-keyboard / focus-engine navigation (`UIFocusHaloEffect`, iOS 15+). This
folder groups every halo-specific file; see the package-root
[CLAUDE.md](../../../CLAUDE.md) and [ios/CLAUDE.md](../../CLAUDE.md) for the wider
view system.

> iOS only. On Android the "halo" is the OS default focus highlight
> (`defaultFocusHighlightEnabled` → `view.setFocusHighlight(...)`), drawn by the
> framework — there is no custom-radius code.

## Structure

Organized by role — view integration → effect orchestration → pure construction:

```
features/Halo/
  RCA11yHaloProtocol.h            contract (the halo props + getFocusTargetView)
  base/      RCA11yKeyboardHaloBase.{h,mm}    view integration (base-chain layer)
  delegate/  RCA11yHaloDelegate.{h,mm}        per-view effect cache + orchestration
  utils/     RCA11yFocusEffectUtility.{h,mm}  stateless UIFocusEffect construction
```

| Role | File | What it does |
|---|---|---|
| contract | `RCA11yHaloProtocol.h` | Capability the halo reads: `isHaloHidden`, `haloCornerRadius`, `haloExpendX/Y`, `roundedHaloFix` (deprecated), `getFocusTargetView`. |
| `base/` | `RCA11yKeyboardHaloBase` | The **view-layer integration** — a link in `RCA11yView`'s base chain (subclass of `RCA11yViewOrderGroupBase`, superclass of `RCA11yViewGroupIdentifierBase`). Owns one delegate, exposes the halo props, and drives the layout refresh. |
| `delegate/` | `RCA11yHaloDelegate` | Per-view cached builder. Turns the view's explicit halo props into an effect (via the util) and caches it; rebuilds only when bounds / radius / a prop changes. Keeps caching out of the view. |
| `utils/` | `RCA11yFocusEffectUtility` | Stateless construction of the `UIFocusHaloEffect` — `emptyFocusEffect` (suppressed) and `getFocusEffect:withExpandedX:withExpandedY:withCornerRadius:` (rounded rect, continuous curve). |

## How it works (control flow)

The halo is **pull-based**: UIKit queries `focusEffect` on the focused view, and the
focused view routes that to the wrapper's `customFocusEffect`, computed on demand.

```
UIKit focuses the view
  → focus target's `focusEffect`
      • wrapper case: a focused child; its category override
        (ios/extensions/RCTViewComponentView+RCA11y.mm) returns parent.customFocusEffect
      • self-focused case (focusableWrapper=false / hidden): RCA11yKeyboardHaloBase's
        own `focusEffect` override returns customFocusEffect
  → RCA11yKeyboardHaloBase.customFocusEffect → RCA11yHaloDelegate.focusEffect
  → builds (or returns cached) effect for getFocusTargetView via RCA11yFocusEffectUtility

The halo is drawn on getFocusTargetView — the view the focus engine actually focused
inside the wrapper (RCA11yFocusDelegate captures it from the focus update), not a
guessed first child.
```

`RCA11yHaloDelegate.focusEffect` resolves to one of three deterministic results:

- **hidden** (`haloEffect={false}` / `tintType="none"`) → `emptyFocusEffect` (suppressed).
- **no custom settings** (no radius, no expand) → `nil` → UIKit draws its own default
  halo, which already tracks the view's bounds. (The "simple" case.)
- **radius / expand set** → a rounded-rect effect built from the focus target's bounds.

### Layout refresh

A static `UIFocusHaloEffect` does **not** follow bounds, and UIKit only re-queries
`focusEffect` at focus-update time — so on geometry change `RCA11yKeyboardHaloBase`
`layoutSubviews` → `refreshHalo` re-pulls `customFocusEffect` and writes it back to the
focus target. It is **gated** on a real change (pointer compare against the delegate's
pointer-stable cached effect), so it can't feed a layout loop. A `nil` effect needs no
refresh — UIKit's default halo tracks bounds itself.

## Design notes / history

- **Radius is an explicit prop**, never observed off `layer.cornerRadius`. `haloCornerRadius`
  shapes the halo only; the view's own `borderRadius` (set via `containerStyle`) is a
  separate concern. The two are not inferred from each other.
- This replaced an older system that observed the live layer radius and re-armed the
  effect through a coalesced `dispatch_after` loop (`_stableRadius`, `setNeedsHaloRearm`,
  `flushHaloRearm`, `_forceRearm`, plus a new-arch `invalidateLayer` override). All of
  that is gone — radius-as-prop + the gated layout refresh make it unnecessary.
- **`roundedHaloFix` is deprecated and ignored.** It suppressed a halo that re-armed from
  the live layer radius; with a deterministic effect always returned, a disabled halo can't
  reappear. The prop is kept (no-op) for back-compat and removed next major.

## JS contract

Props flow from `src/components/A11yView/A11yView.tsx` → `RCA11yView` codegen props:
`haloEffect` (→ `isHaloHidden`), `haloCornerRadius`, `haloExpendX`, `haloExpendY`,
`tintColor`, `roundedHaloFix` (ignored). New-arch updates arrive via
`RCA11yKeyboardHaloBase updateHaloProps:newProps:`; old-arch via the `ReactProp` setters in
the view managers. Mirror any spec change on Android (`A11yViewManager` keeps these as
stubs except `haloEffect` → `setFocusHighlight`).
