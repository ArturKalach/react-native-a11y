# Native focus styling — halo, tint & Android highlight

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (focus-styling-ios.gif) --> <img src="../images/focus-styling-ios.gif" height="400" alt="Native focus styling on iOS" /> | <!-- TODO: capture combined-package demo (focus-styling-android.gif) --> <img src="../images/focus-styling-android.gif" height="400" alt="Native focus styling on Android" /> |

Beyond your own `focusStyle` ([see Pressable focus handling](./pressable-focus.md)),
each platform draws a **native** focus indicator. This guide covers configuring and
disabling it: the iOS halo (`haloEffect`, `tintColor`, `haloExpendX`/`haloExpendY`,
`haloCornerRadius`) and the Android highlight (`defaultFocusHighlightEnabled`).

| Platform | Native indicator | Controlled by |
| :-- | :-- | :-- |
| iOS | The focus **halo** (a ring drawn around the focused view) | `haloEffect`, `tintColor`, `halo*` props |
| Android | The system **focus highlight** | `defaultFocusHighlightEnabled` |
| Both | Cross-platform shortcut to turn the native indicator **off** | `tintType="none"` |

Both are **enabled by default**. The iOS halo props have no effect on Android, and
`defaultFocusHighlightEnabled` has no effect on iOS. To switch the native indicator off
on **both** platforms with one prop, use [`tintType="none"`](#turning-off-all-native-indicators).

---

## iOS — the halo effect

On iOS the focused view gets a halo ring (`UIFocusHaloEffect`). It is on by default.

The halo and the view's shape are **separate**: `haloEffect` toggles the ring,
`haloCornerRadius` / `haloExpend*` shape the **halo** (they don't change the view), and
`containerStyle` / `style` round the **view** (they don't change the halo). To round the
halo to match a rounded view, set `haloCornerRadius` to the same value.

```tsx
<A11y.Pressable haloEffect tintColor="dodgerblue" onPress={onPress}>
  <Text>Halo on focus</Text>
</A11y.Pressable>
```

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `haloEffect` | `boolean` | `true` | Draw the halo ring on focus. |
| `tintColor` | `string` | — | Color of the halo / focus tint. |
| `haloCornerRadius` | `number` | `0` | Corner radius of the halo ring, in points. |
| `haloExpendX` | `number` | `0` | Horizontal expansion of the ring beyond the view bounds, in points. |
| `haloExpendY` | `number` | `0` | Vertical expansion of the ring beyond the view bounds, in points. |

### Shaping the halo

`haloExpendX` / `haloExpendY` push the ring outward so it doesn't hug the content too
tightly, and `haloCornerRadius` rounds it to match a rounded button. Round the view
through `containerStyle` and set `haloCornerRadius` to the same value — the halo is drawn
on the focused view, so the radius isn't inferred:

```tsx
<A11y.Pressable
  haloEffect
  tintColor="dodgerblue"
  haloExpendX={6}
  haloExpendY={6}
  haloCornerRadius={12}        // match the container's borderRadius
  containerStyle={{ borderRadius: 12 }}
  onPress={onPress}
>
  <Text>Rounded, padded halo</Text>
</A11y.Pressable>
```

> [!NOTE]
> `UIFocusHaloEffect` takes a single corner radius, so the halo is always uniformly
> rounded even if the container uses per-corner radii.

### Disabling the iOS halo

Set `haloEffect={false}` to turn the ring off (for example, when you draw your own focus
ring via `focusStyle` / `containerFocusStyle`):

```tsx
<A11y.Pressable
  haloEffect={false}
  containerFocusStyle={{ borderWidth: 2, borderColor: 'dodgerblue' }}
  onPress={onPress}
>
  <Text>Custom ring, no halo</Text>
</A11y.Pressable>
```

A disabled halo now **stays disabled** on rounded views — `haloEffect={false}` resolves
to a suppressed effect that no longer re-arms from the view's `layer.cornerRadius`, so
there is nothing extra to do. Keep applying rounding on `containerStyle` (the wrapper)
rather than on the focused view:

```tsx
<A11y.Pressable
  haloEffect={false}
  containerStyle={{ borderRadius: 16 }}
  onPress={onPress}
>
  <Text>Rounded, no halo</Text>
</A11y.Pressable>
```

> [!NOTE]
> The `roundedHaloFix` prop is **deprecated and ignored** — it is no longer needed and
> will be removed in the next major. It was a workaround for the halo re-arming itself
> from the live layer radius; the halo is now driven only by `haloCornerRadius` /
> `haloExpend*`, so a disabled halo can't reappear.

---

## Android — the default focus highlight

Android draws its own system focus highlight on the focused native view, controlled by
`defaultFocusHighlightEnabled` (on by default). The iOS `haloEffect` / `tintColor` /
`halo*` props do nothing on Android.

```tsx
// Disable Android's native highlight (e.g. when using your own focusStyle)
<A11y.Pressable
  defaultFocusHighlightEnabled={false}
  focusStyle={{ backgroundColor: '#e0e0e0' }}
  onPress={onPress}
>
  <Text>Custom highlight only</Text>
</A11y.Pressable>
```

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | Enable Android's default focus highlight for the focused native view. |

---

## Turning off all native indicators

To rely entirely on your own `focusStyle` / `containerFocusStyle` across both platforms,
disable both native indicators. The simplest way is `tintType="none"` — a cross-platform
shortcut that turns the iOS halo **and** the Android highlight off in one prop:

```tsx
<A11y.Pressable
  tintType="none" // iOS halo + Android highlight, both off
  focusStyle={({ focused }) => ({
    backgroundColor: focused ? 'dodgerblue' : 'transparent',
  })}
  onPress={onPress}
>
  <Text>Fully custom focus look</Text>
</A11y.Pressable>
```

`tintType="none"` is equivalent to setting `haloEffect={false}` on iOS and
`defaultFocusHighlightEnabled={false}` on Android:

```tsx
<A11y.Pressable
  haloEffect={false}                   // iOS
  defaultFocusHighlightEnabled={false} // Android
  focusStyle={({ focused }) => ({
    backgroundColor: focused ? 'dodgerblue' : 'transparent',
  })}
  onPress={onPress}
>
  <Text>Fully custom focus look</Text>
</A11y.Pressable>
```

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `tintType` | `'default' \| 'none'` | `'default'` | `'none'` disables the native focus indicator on both platforms (iOS halo + Android highlight). `'default'` keeps it. |

> [!NOTE]
> `tintType="none"` suppresses the iOS halo just like `haloEffect={false}` — a disabled
> halo stays off on rounded views with nothing extra to do. It works on `A11y.Input` too.

---

## Related

- [Pressable focus handling](./pressable-focus.md) — `focusStyle`, `containerFocusStyle`, render props
- [Component overview → common focus props](../components/overview.md#common-focus-props)

---

← [Pressable focus handling](./pressable-focus.md) · [Programmatic focus →](./programmatic-focus.md)
