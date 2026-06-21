# Component overview

Everything ships under the single `A11y` namespace. The focusable views (`A11y.View`,
`A11y.Pressable`, `A11y.Input`) share a set of **common focus props** for keyboard focus,
and accept screen-reader props on top — each capability is opt-in and does work only when
its props are present.

| Component | Wraps | Use it when |
| :-- | :-- | :-- |
| [`A11y.View`](#a11yview) | `View` | You need a focus container, key handling, screen-reader events, or iOS containers — not a button |
| [`A11y.Pressable`](#a11ypressable) | `Pressable` | A button / tappable row needs keyboard + screen-reader focus |
| [`A11y.Input`](#a11yinput) | `TextInput` | A text field needs keyboard-driven focus behavior |
| [`A11y.Order` / `A11y.Index`](#a11yorder--a11yindex) | context + `View` | You need an explicit screen-reader traversal order |
| [`A11y.Card`](#a11ycard) | `View` + `Pressable` | A tappable card must keep its inner buttons accessible |
| [`A11y.FocusTrap` / `A11y.FocusFrame`](#a11yfocustrap--a11yfocusframe) | `View` | Confine SR + keyboard focus inside a modal/overlay |
| [`A11y.PaneTitle` / `A11y.ScreenChange`](#a11ypanetitle--a11yscreenchange) | — | Announce a screen / panel transition |
| [`A11y.FocusGroup`](#a11yfocusgroup) | `View` | iOS focus grouping or a shared `tintColor` |
| [`withKeyboardFocus`](#withkeyboardfocus) | any touchable | Add keyboard focus to your own `Pressable`/`Touchable` |
| [`KeyboardOrderFocusGroup`](#keyboardorderfocusgroup) | context | Namespace keyboard `orderId`s or order by index |

---

## Common focus props

Shared by `A11y.View`, `A11y.Pressable`, and `withKeyboardFocus`-wrapped components. These
drive the **keyboard** focus capability.

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `focusable` | `boolean` | `true` | Whether the component can receive keyboard focus. |
| `autoFocus` | `boolean` | — | Automatically take keyboard focus on mount. |
| `onFocus` | `() => void` | — | Called when the component gains keyboard focus. |
| `onBlur` | `() => void` | — | Called when the component loses keyboard focus. |
| `onFocusChange` | `(isFocused: boolean, tag?: number) => void` | — | Called on focus or blur. |
| `onKeyDownPress` | `(e: OnKeyPress) => void` | — | Physical key-down handler. See [`KeyPress`](../api/overview.md#keypress). |
| `onKeyUpPress` | `(e: OnKeyPress) => void` | — | Physical key-up handler. |
| `tintColor` | `string` | — | Color used to tint the component on focus. |
| `haloEffect` | `boolean` | — | *(iOS)* Draw the focus halo ring on focus. |
| `haloCornerRadius` | `number` | — | *(iOS)* Corner radius of the halo ring, in points. |
| `haloExpendX` | `number` | — | *(iOS)* Horizontal expansion of the halo beyond the view bounds. |
| `haloExpendY` | `number` | — | *(iOS)* Vertical expansion of the halo beyond the view bounds. |
| `roundedHaloFix` | `boolean` | — | *(iOS)* When `haloEffect={false}`, keeps the disabled halo from reappearing on rounded (`borderRadius`) views. [Why & alternative](../guides/focus-styling.md#roundedhalofix). |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | *(Android)* Enables Android's default focus highlight. |
| `tintType` | `'default' \| 'none'` | `'default'` | Cross-platform shortcut: `'none'` disables the native focus indicator on both platforms (iOS halo + Android highlight). [Details](../guides/focus-styling.md#turning-off-all-native-indicators). |
| `groupIdentifier` | `string` | — | *(iOS)* `focusGroupIdentifier` this view belongs to. |
| `focusableWrapper` | `boolean` | — | Treat the view as a transparent focus wrapper rather than a focusable target itself. |
| `enableContextMenu` | `boolean` | — | Enable the context-menu interaction on the view. |
| `onContextMenuPress` | `() => void` | — | *(iOS)* Long-press via the context-menu command (`Tab + M`). |
| `onBubbledContextMenuPress` | `() => void` | — | *(iOS)* Bubbling variant of `onContextMenuPress` from descendants. |
| `screenAutoA11yFocus` | `boolean` | — | Move screen-reader focus to this element automatically. |
| `screenAutoA11yFocusDelay` | `number` | `300` | *(Android)* Delay (ms) before screen-reader auto-focus; render may take 300–500 ms. |
| `optimistic` | [`A11yOptimisticConfig`](../guides/optimistic-state.md) | — | *(iOS)* Optimistic accessibility-value announcements. |
| [Focus-order props](../api/overview.md#focus-order-props) | — | — | `orderId`, `order*`, `orderIndex`, `orderGroup`, `orderPrefix`. |
| `lockFocus` | [`LockFocusType[]`](../api/overview.md#lockfocustype) | — | Directions in which keyboard focus movement is locked. |

---

## A11y.View

The unified focusable `View`. It accepts the [common focus props](#common-focus-props)
(keyboard) **and** screen-reader props — use it for key handling, focus containers,
screen-reader focus events, or iOS semantic containers. `A11y.Index` is the same
component wired into an `A11y.Order` sequence.

```tsx
<A11y.View
  // keyboard
  onKeyDownPress={onKey}
  focusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  // screen reader
  a11yUIContainer="list"
  accessibilityLabel="Menu. 4 items."
  onScreenReaderFocused={() => {}}
>
  {/* …items… */}
</A11y.View>
```

### Props

All standard `ViewProps`, all [common focus props](#common-focus-props), plus:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `style` | `StyleProp<ViewStyle>` | — | Style for the inner component. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the inner component when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the container when focused. |
| `orderType` | `'auto' \| 'keyboard' \| 'screen-reader'` | `'auto'` | Which ordering engine applies. |
| `screenReaderFocusTarget` | `'self' \| 'firstAccessible' \| 'child'` | `'self'` | Which element the screen reader treats as this view's focus node. See [Screen-reader focus order](../guides/a11y-order.md#screenreaderfocustarget--which-element-gets-focused). |
| `index` | `number` | — | Positional index within an enclosing `A11y.Order`. Throws if used outside one. |
| `a11yUIContainer` | `'none' \| 'table' \| 'list' \| 'landmark' \| 'group'` | — | *(iOS)* `UIAccessibilityContainerType`. See [iOS semantic containers](../guides/a11y-ui-container.md). |
| `shouldGroupAccessibilityChildren` | `boolean` | — | *(iOS)* `shouldGroupAccessibilityChildren`. |
| `onScreenReaderFocused` | `() => void` | — | Fires when SR focuses this element directly. |
| `onScreenReaderSubViewFocused` | `() => void` | — | Fires when SR focus enters a descendant. |
| `onScreenReaderSubViewBlurred` | `() => void` | — | Fires when SR focus leaves a descendant. |
| `onScreenReaderSubViewFocusChange` | `(isFocused: boolean) => void` | — | Fires on any descendant focus change. |
| `onScreenReaderDescendantFocusChanged` | `(e: ScreenReaderDescendantFocusChangedEvent) => void` | — | Full native event; carries `{ status, nativeId }`. |

See [Screen-reader focus events](../guides/focus-events.md) for the callback details.

---

## A11y.Pressable

A keyboard- and screen-reader-focusable `Pressable` (created via `withKeyboardFocus`). Use
it for buttons and tappable rows.

```tsx
<A11y.Pressable
  autoFocus
  onPress={onPress}
  focusStyle={{ backgroundColor: 'dodgerblue' }}
>
  <Text>Press me</Text>
</A11y.Pressable>
```

### Props

All `PressableProps`, all [common focus props](#common-focus-props), plus the
`withKeyboardFocus` props:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `style` | `StyleProp<ViewStyle>` | — | Styles the inner component. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the inner component when focused. |
| `containerStyle` | `StyleProp<ViewStyle>` | — | Style for the container. |
| `containerFocusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | — | Style applied to the container when focused. |
| `renderContent` | `(state: ChildrenRenderState & { focused: boolean }) => ReactNode` | — | For components whose `children` is a render function (e.g. `Pressable`); merges the component's own render state with `{ focused }`. |
| `renderFocusable` | `(state: { focused: boolean }) => ReactNode` | — | Replaces `children` with a render prop receiving `{ focused }`. For components without a render-prop `children`. |
| `triggerCodes` | `number[]` | space + enter | Key codes that trigger `onPress` / `onLongPress`. |
| `ref` | `Ref<KeyboardFocus>` | — | Imperative [focus handle](../api/overview.md#imperative-ref-keyboardfocus). |
| `componentRef` | `RefObject<ViewType>` | — | Ref to the wrapped component instance. |

See [Pressable focus handling](../guides/pressable-focus.md).

---

## A11y.Input

A `TextInput` with keyboard focus support. Exported props type: `A11yInputProps`.

```tsx
<A11y.Input value={text} onChangeText={setText} focusType="default" blurType="default" />
```

### Props

All standard `TextInputProps`, plus:

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `focusable` | `boolean` | `true` | Whether the input can be keyboard-focused. Also controls `editable`. |
| `focusType` | `'default' \| 'press' \| 'auto'` | `'default'` | How the input takes keyboard focus. See [Keyboard text input](../guides/text-input.md#focustype--how-the-field-takes-keyboard-focus). |
| `blurType` | `'default' \| 'disable' \| 'auto'` | `'default'` | *(iOS)* Blur behavior when focus moves away. |
| `onSubmitEditing` | `(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void` | — | Extended `onSubmitEditing` supporting multiline input. |
| `onFocusChange` | `(isFocused: boolean) => void` | — | Called on focus or blur. |
| `haloEffect` | `boolean` | `true` | *(iOS)* Halo ring on focus. |
| `roundedHaloFix` | `boolean` | `false` | *(iOS)* Keep a disabled halo suppressed on rounded views. |
| `defaultFocusHighlightEnabled` | `boolean` | `true` | *(Android)* Default focus highlight. |
| `tintType` | `'default' \| 'none'` | `'default'` | Cross-platform: `'none'` disables the native indicator. |
| `tintColor` | `string` | — | *(iOS)* Tint color on focus. |
| `style` / `focusStyle` / `containerStyle` / `containerFocusStyle` | — | — | Same focus-styling props as `A11y.Pressable`. |
| `lockFocus` / `order*` / `orderIndex` / `orderGroup` | — | — | Keyboard focus-order props. See [Keyboard focus order](../guides/focus-order.md). |

---

## A11y.Order / A11y.Index

Declarative **screen-reader** traversal order. `A11y.Order` provides a sequence context;
each `A11y.Index` child declares its position via `index`. `A11y.Index` is the same
component as `A11y.View` (so it accepts the same screen-reader and keyboard props).

```tsx
<A11y.Order>
  <A11y.Index index={1}><Text>First</Text></A11y.Index>
  <A11y.Index index={2}><Text>Second</Text></A11y.Index>
</A11y.Order>
```

| Component | Props |
| :-- | :-- |
| `A11y.Order` | All standard `ViewProps`. No additional props. |
| `A11y.Index` | `index` (number) + everything [`A11y.View`](#a11yview) accepts. Full table in the [Screen-reader focus order guide](../guides/a11y-order.md#a11yindex-props). |

> Using `A11y.Index` outside an `A11y.Order` throws by design.

---

## A11y.Card

A tappable card that keeps its inner interactive elements accessible to the screen reader.
The card surface is keyboard-focusable (backed by `A11y.Pressable`) unless you swap it via
`PressableComponent`.

```tsx
<A11y.Card
  onPress={onPress}
  accessibility={{ accessibilityLabel: 'Product card' }}
>
  <Text>Product</Text>
  <Button title="Add" onPress={addToCart} />
</A11y.Card>
```

### Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `onPress` | `() => void` | Called on press / screen-reader activation. |
| `accessibility` | `ViewProps` | Screen-reader-facing props. iOS → overlay; Android → Pressable. |
| `style` | `StyleProp<ViewStyle>` | Visual style for the inner card surface. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style while the surface holds keyboard focus (default `A11y.Pressable` only). |
| `containerProps` | `ViewProps` | Layout props for the outer container. |
| `pressableProps` | `Omit<A11yPressableProps, …>` | Extra props for the backing `A11y.Pressable`. |
| `PressableComponent` | `ComponentType<any>` | Surface component. Defaults to `A11y.Pressable`; pass a plain one to opt out of keyboard focus. |
| `testID` | `string` | Forwarded to the surface. |
| `children` | `ReactNode` | Card content. |

See [Cards with inner buttons](../guides/a11y-card.md).

---

## A11y.FocusTrap / A11y.FocusFrame

A unified pair that confines **both** screen-reader and physical-keyboard focus to a
region — modals, sheets, overlays. `A11y.FocusTrap` must be a descendant of an
`A11y.FocusFrame`.

```tsx
<A11y.FocusFrame style={{ flex: 1 }}>
  <MainContent />
  {visible && (
    <A11y.FocusTrap forceLock>
      <Text accessibilityRole="header">Locked area</Text>
      <Button title="Close" onPress={onClose} />
    </A11y.FocusTrap>
  )}
</A11y.FocusFrame>
```

### A11y.FocusTrap props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `lockDisabled` | `boolean` | `false` | When `true`, the trap is inactive and focus can leave freely. |
| `forceLock` | `boolean` | `false` | Actively redirects focus back into the trap when it escapes; moves focus inside on mount. |
| `...ViewProps` | — | — | All standard `View` props. |

### A11y.FocusFrame props

All standard `ViewProps`. No additional props.

See [Focus lock](../guides/focus-lock.md).

---

## A11y.PaneTitle / A11y.ScreenChange

Announce screen and panel transitions to the screen reader. `A11y.ScreenChange` is
`A11y.PaneTitle` pre-set to `type="activity"`.

```tsx
<A11y.ScreenChange title="Home Screen" displayed={isFocused} />
<A11y.PaneTitle title="Filters" detachMessage="Filters closed" />
```

### Props

| Prop | Type | Default | Description |
| :-- | :-- | :-- | :-- |
| `title` | `string` | — | Title announced on mount. |
| `detachMessage` | `string` | — | Message announced on unmount. |
| `type` | `'activity' \| 'pane' \| 'announce'` | `'pane'` | Announcement mechanism. *(`A11y.PaneTitle` only.)* |
| `withFocusRestore` | `boolean` | `true` | Restore focus to the previously focused element on unmount. |
| `displayed` | `boolean` | `true` | When `false`, renders nothing and posts no announcement. |

See [Announcements](../guides/announcements.md#a11ypanetitle--a11yscreenchange).

---

## A11y.FocusGroup

A `View`-based component built on the iOS focus API. Define an iOS focus group
(`focusGroupIdentifier`) or set a `tintColor` for everything inside.

```tsx
<A11y.FocusGroup
  groupIdentifier="green"
  tintColor="green"
  focusStyle={{ backgroundColor: 'green' }}
  onFocusChange={(isFocused) => console.log('green', isFocused)}
>
  <Button title="Confirm" />
</A11y.FocusGroup>
```

### Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `groupIdentifier` | `string` | *(iOS)* The `focusGroupIdentifier` this view defines. |
| `tintColor` | `string` | Tint color applied to focused descendants. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style applied to the inner component when focused. |
| `orderGroup` | `string` | Keyboard order-group name for descendants. |
| `onFocus` / `onBlur` | `() => void` | Group focus / blur. |
| `onFocusChange` | `(isFocused: boolean) => void` | Called on focus or blur. |
| `...ViewProps` | — | All standard `View` properties. |

---

## withKeyboardFocus

HOC that wraps any `Pressable`/`Touchable`-like component, adding keyboard focus/blur
events, focus styling, `autoFocus`, and the imperative focus `ref`.

```tsx
import { withKeyboardFocus } from 'react-native-a11y';

const KeyboardTouchable = withKeyboardFocus(TouchableOpacity);
```

> [!TIP]
> For a plain `Pressable` you don't need the HOC — `A11y.Pressable` is already wrapped.

It adds the same props listed under [`A11y.Pressable`](#a11ypressable). See the
[API reference](../api/overview.md#withkeyboardfocus-hoc) for the HOC contract and render
props.

---

## KeyboardOrderFocusGroup

A context provider for **keyboard** focus ordering with two jobs:

1. **Namespacing** — automatically prefixes every `orderId` inside it so duplicate IDs in
   repeated content (lists, cards) don't collide.
2. **Index-based ordering** — children that declare `orderIndex` are focused in ascending
   index order within the group.

```tsx
<KeyboardOrderFocusGroup>
  <A11y.Pressable onPress={onPress} orderIndex={0}><Text>First</Text></A11y.Pressable>
  <A11y.Pressable onPress={onPress} orderIndex={1}><Text>Second</Text></A11y.Pressable>
</KeyboardOrderFocusGroup>
```

| Prop | Type | Description |
| :-- | :-- | :-- |
| `groupId` | `string` | Optional explicit group name. Auto-generated when omitted. |
| `children` | `ReactNode` | Child components. |

See [Keyboard focus order](../guides/focus-order.md) for the full set of `order*` props.

---

← [Connection & runtime status](../guides/keyboard-connection-status.md) · [API reference →](../api/overview.md)
