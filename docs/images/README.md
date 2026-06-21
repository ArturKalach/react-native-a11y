# Documentation media — capture checklist

The docs reference demo GIFs that have **not yet been captured** for the combined
package. Each referenced file is marked in the source with an
`<!-- TODO: capture combined-package demo (<name>.gif) -->` comment next to its `<img>`.

Capture a recording on a real device per platform, drop the file in this folder with the
filename below, and delete the matching TODO comment.

> Tip: the split packages already ship comparable recordings you can re-shoot or adapt —
> see `react-native-external-keyboard/docs/images/` and
> `react-native-a11y-order/docs/images/` for reference framing.

| File | Used in | Shows |
| :-- | :-- | :-- |
| `hero-ios.gif` / `hero-android.gif` | [README](../README.md) | Overall package demo |
| `getting-started-ios.gif` / `getting-started-android.gif` | [getting-started](../getting-started/getting-started.md) | Quick-start example |
| `keyboard-pressable-ios.gif` / `keyboard-pressable-android.gif` | [pressable-focus](../guides/pressable-focus.md) | Pressable focus/blur + styling |
| `focus-styling-ios.gif` / `focus-styling-android.gif` | [focus-styling](../guides/focus-styling.md) | iOS halo + Android highlight |
| `programmatic-focus-ios.gif` / `programmatic-focus-android.gif` | [programmatic-focus](../guides/programmatic-focus.md) | `ref.focus()` driven focus |
| `keyboard-input-ios.gif` / `keyboard-input-android.gif` | [text-input](../guides/text-input.md) | `A11y.Input` focus behavior |
| `focus-order-ios.gif` / `focus-order-android.gif` | [focus-order](../guides/focus-order.md) | Keyboard `Tab` / arrow ordering |
| `sr-order-ios.gif` / `sr-order-android.gif` | [a11y-order](../guides/a11y-order.md) | Screen-reader traversal order |
| `a11y-card-ios.gif` / `a11y-card-android.gif` | [a11y-card](../guides/a11y-card.md) | Card with accessible inner buttons |
| `ui-container-ios.gif` | [a11y-ui-container](../guides/a11y-ui-container.md) | iOS semantic container announcements |
| `focus-events-ios.gif` / `focus-events-android.gif` | [focus-events](../guides/focus-events.md) | Screen-reader focus callbacks |
| `focus-lock-ios.gif` / `focus-lock-android.gif` | [focus-lock](../guides/focus-lock.md) | Focus trap in a modal |
| `optimistic-ios.gif` | [optimistic-state](../guides/optimistic-state.md) | Predicted vs stale VoiceOver value |
| `status-ios.gif` | [keyboard-connection-status](../guides/keyboard-connection-status.md) | Live keyboard / screen-reader status |
