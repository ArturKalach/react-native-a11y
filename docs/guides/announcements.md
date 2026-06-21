# Announcements

Send messages to the screen reader (VoiceOver / TalkBack). Unlike
`AccessibilityInfo.announceForAccessibility`, `announce` / `ScreenReader` use a native
queue on iOS so messages survive transitions, and `A11y.PaneTitle` / `A11y.ScreenChange`
hook into the native accessibility transition system for screen changes.

```tsx
import { announce, ScreenReader, A11y } from 'react-native-a11y';
```

## The problem with the built-in API

`AccessibilityInfo.announceForAccessibility` can be interrupted or dropped when a focus
change happens at the same time — for example, when a screen transition fires immediately
before or after the announce call. This is common when navigating between screens or
opening modals.

## `announce` / `ScreenReader`

```tsx
// ScreenReader.announce uses calm mode by default (navigation-aware)
await ScreenReader.announce('Changes saved successfully');

// Direct announce — posts immediately, more control over timing
await announce('Item added to cart');

// With options
await announce('Action completed', { priority: 'high', delayMs: 300 });

// Cancel a specific announcement
const result = await ScreenReader.announce('Loading…');
await ScreenReader.cancel(result.id);

// Cancel all pending announcements
await ScreenReader.cancelAll();
```

### Calm mode (`calm: true`)

Navigation-aware. Waits for:

- Active navigation transitions to finish (1 s lock after a screen change)
- The screen reader to have a focused element
- A 300 ms debounce to prevent overlap with focus changes

`ScreenReader.announce` always uses calm mode. The returned Promise resolves when the
announcement is **actually fired**, not just enqueued.

### Direct mode (`calm: false`, default for `announce()`)

Posts immediately with the given speech attributes. On iOS, the Promise resolves when
VoiceOver confirms speech finished (`status: 'spoken'`) or was interrupted
(`status: 'fired'`). On Android, always resolves immediately with `status: 'fired'`.

### Options

| Option | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `priority` | `'low' \| 'default' \| 'high'` | `'default'` | Controls urgency and queue insertion order. iOS 17+: maps to `UIAccessibilityPriority`. |
| `queue` | `boolean` | `true` | When `true`, waits for current speech before speaking. When `false`, may interrupt. |
| `calm` | `boolean` | `false` | Navigation-aware mode. Waits for transitions and a focused element before speaking. |
| `delayMs` | `number` | `0` | Explicit delay in ms before the announcement is posted. Ignored in calm mode. |
| `speech` | `SpeechOptions` | — | iOS-only speech characteristics (`language`, `pitch`, `spellOut`, `punctuation`, `ipaNotation`). No-op on Android; only relevant in direct mode. |

Full type tables are in the [API reference → Announcements](../api/overview.md#announcements).

## `A11y.PaneTitle` / `A11y.ScreenChange`

For navigation transitions, prefer the declarative components — they integrate with the
native accessibility transition system and can restore focus on unmount.

```tsx
// Full-screen navigation (shorthand for type="activity")
<A11y.ScreenChange title="Home Screen" displayed={isFocused} />

// Panel / region change
<A11y.PaneTitle title="Filters" detachMessage="Filters closed" />
```

`A11y.ScreenChange` is `A11y.PaneTitle` pre-set to `type="activity"`.

### Props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `title` | `string` | — | Title announced when the component mounts. |
| `detachMessage` | `string` | — | Message announced when the component unmounts. |
| `type` | `'activity' \| 'pane' \| 'announce'` | `'pane'` | Announcement mechanism: `'pane'` (layout-changed notification with title), `'activity'` (full-screen nav), `'announce'` (plain message, no focus shift). *(`A11y.PaneTitle` only — `A11y.ScreenChange` fixes this to `'activity'`.)* |
| `withFocusRestore` | `boolean` | `true` | Restore focus to the previously focused element on unmount. |
| `displayed` | `boolean` | `true` | When `false`, renders nothing and posts no announcement. |

## Choosing between them

| Situation | Use |
| :-- | :-- |
| A screen-level navigation change | `A11y.ScreenChange` |
| A panel / region appearing or changing | `A11y.PaneTitle` |
| A one-off status message (form result, toast) | `announce` / `ScreenReader.announce` |
| A modal not handled by `A11y.ScreenChange` | `ScreenReader.announce` |

```tsx
// Prefer this for navigation
<A11y.ScreenChange title="Home Screen" displayed={isFocused} />;

// Use announce for one-off status messages
ScreenReader.announce('Item added to cart');
```

## Related

- [API reference → Announcements](../api/overview.md#announcements) — full option/type tables
- [Focus lock](./focus-lock.md) — pairing `A11y.ScreenChange` with a modal trap

---

← [Screen-reader focus events](./focus-events.md) · [Optimistic accessibility values →](./optimistic-state.md)
