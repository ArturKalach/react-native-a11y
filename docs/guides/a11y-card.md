# Cards with inner interactive elements

| iOS | Android |
| --- | --- |
| <!-- TODO: capture combined-package demo (a11y-card-ios.gif) --> <img src="../images/a11y-card-ios.gif" height="400" alt="A11y.Card on iOS" /> | <!-- TODO: capture combined-package demo (a11y-card-android.gif) --> <img src="../images/a11y-card-android.gif" height="400" alt="A11y.Card on Android" /> |

`A11y.Card` solves a common accessibility problem: a tappable card that also contains
interactive children (buttons, links) that must remain individually accessible to the
screen reader.

## The problem

A `Pressable` that contains other `Pressable` elements breaks VoiceOver on iOS. VoiceOver
treats the outer `Pressable` as a leaf node and hides its children — the inner buttons
become unreachable. TalkBack handles this correctly by default.

## How A11y.Card works

**iOS**: A full-cover invisible overlay view is placed as the first `accessibilityElement`
inside the card. VoiceOver focuses the overlay — activating the card action via
`onAccessibilityTap`. Sighted users tap through to the `Pressable` directly. The inner
`Pressable` is `accessible={false}`, so VoiceOver ignores it and navigates to the inner
buttons directly after the overlay.

The native view assigns separate `focusGroupIdentifier` values to the overlay and the
content subtree, which allows Full Keyboard Access to navigate from the card label into
the inner buttons using arrow keys.

**Android**: No overlay is needed. TalkBack does not block child focus, so the card acts
as a standard accessible `Pressable`.

## Basic usage

```tsx
import { A11y } from 'react-native-a11y';

<A11y.Card
  onPress={() => navigation.navigate('Detail')}
  accessibility={{
    accessibilityLabel: 'Product card',
    accessibilityHint: 'Opens product detail',
  }}
>
  <Text>Product name</Text>
  <Button title="Add to cart" onPress={addToCart} />
</A11y.Card>
```

The `Button` inside is fully reachable by VoiceOver after the card overlay is focused.

## Nested cards

Cards can be nested. Inner cards are independently focusable:

```tsx
<A11y.Card
  onPress={openDetail}
  accessibility={{ accessibilityLabel: 'Matcha Latte, $5.50' }}
>
  <Text>Matcha Latte</Text>
  <A11y.Card
    onPress={addToCart}
    accessibility={{ accessibilityLabel: 'Add to cart' }}
  >
    <View>
      <Text>+</Text>
    </View>
  </A11y.Card>
</A11y.Card>
```

## Layout vs visual style

- `containerProps` — layout in the parent (margins, flex, positioning). Applied to the
  outer wrapping view.
- `style` — visual appearance (background, border, shadow). Applied to the inner card
  surface.

```tsx
<A11y.Card
  containerProps={{ style: { marginBottom: 12 } }}
  style={{ backgroundColor: '#fff', borderRadius: 12 }}
  onPress={onPress}
  accessibility={{ accessibilityLabel: 'Card' }}
>
  {children}
</A11y.Card>
```

## Keyboard focus on the card

By default the card surface is an `A11y.Pressable`, so it is keyboard-focusable and
accepts focus styling through `focusStyle` and `pressableProps`:

```tsx
<A11y.Card
  onPress={onPress}
  accessibility={{ accessibilityLabel: 'Card' }}
  focusStyle={{ borderColor: 'dodgerblue', borderWidth: 2 }}
  pressableProps={{ tintColor: 'dodgerblue' }}
>
  {children}
</A11y.Card>
```

To opt out of keyboard focus entirely, pass a plain Pressable-like component via
`PressableComponent` (e.g. RN `Pressable` or `TouchableOpacity`).

## Props

| Prop | Type | Description |
| :-- | :-- | :-- |
| `onPress` | `() => void` | Called when the card is pressed or activated by the screen reader. |
| `accessibility` | `ViewProps` | Screen-reader-facing props (`accessibilityLabel`, `accessibilityHint`, `accessibilityRole`, `accessibilityState`, …). On iOS forwarded to the overlay; on Android to the Pressable. |
| `style` | `StyleProp<ViewStyle>` | Visual style for the inner card surface. |
| `focusStyle` | [`FocusStyle`](../api/overview.md#focusstyle) | Style merged onto the card surface while it holds keyboard focus (default `A11y.Pressable` only). |
| `containerProps` | `ViewProps` | Layout props for the outer container. |
| `pressableProps` | `Omit<A11yPressableProps, …>` | Escape hatch for the backing `A11y.Pressable` — `containerStyle` / `containerFocusStyle`, render props, `tintColor` / `tintType`, `onFocusChange`, `halo*` / `order*` props, etc. |
| `PressableComponent` | `ComponentType<any>` | Component for the card surface. Defaults to `A11y.Pressable`. Pass a plain Pressable-like component to opt out of keyboard focus. |
| `testID` | `string` | Test identifier forwarded to the card surface. |
| `children` | `React.ReactNode` | Card content. Interactive children remain accessible to the screen reader. |

---

← [Screen-reader focus order](./a11y-order.md) · [Focus lock →](./focus-lock.md)
