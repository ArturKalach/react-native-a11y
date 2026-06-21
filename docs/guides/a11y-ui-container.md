# iOS semantic containers

`a11yUIContainer` is an iOS-only prop available on `A11y.View` and `A11y.Index`. It sets
`UIAccessibilityContainerType` on the native view so VoiceOver announces the right
semantic grouping when entering a section.

<!-- TODO: capture combined-package demo (ui-container-ios.gif) -->
<img src="../images/ui-container-ios.gif" height="400" alt="UI container semantics on iOS" />

## Why this matters

VoiceOver on iOS understands semantic container types. When you wrap a list of items with
`a11yUIContainer="list"`, VoiceOver announces "list, 4 items" when entering and "2 of 4"
as the user navigates through rows. Without it, the items are read as plain elements with
no context.

## Container types

| Value | VoiceOver behavior |
| :-- | :-- |
| `'list'` | Announces "list, N items" on entry; reads position ("2 of 4") on each row. |
| `'table'` | Treats the area as tabular data; reads row and column context. |
| `'landmark'` | Marks a major page region; users can jump between landmarks via the VoiceOver rotor. |
| `'group'` | Generic semantic grouping for related items that don't fit another category. |
| `'none'` | Removes any previously set container type. |

## Usage with A11y.View

`A11y.View` is the right component when you only need container semantics and focus
events — no ordering required.

### List

```tsx
<A11y.View a11yUIContainer="list" accessibilityLabel="Menu. 4 items.">
  {['Espresso', 'Cappuccino', 'Latte', 'Americano'].map((label) => (
    <View key={label} accessible accessibilityLabel={label}>
      <Text>{label}</Text>
    </View>
  ))}
</A11y.View>
```

VoiceOver announces: "Menu. 4 items. list" on entry.

### Table

```tsx
<A11y.View a11yUIContainer="table" accessibilityLabel="Schedule. 3 rows.">
  {rows.map(([day, hours]) => (
    <View key={day} accessible accessibilityLabel={`${day}, ${hours} hours`}>
      <Text>{day}</Text>
      <Text>{hours}</Text>
    </View>
  ))}
</A11y.View>
```

### Landmark

```tsx
<A11y.View a11yUIContainer="landmark" accessibilityLabel="Promotions">
  <Text>Free delivery on orders over $20 this week.</Text>
  <Pressable accessibilityRole="button" accessibilityLabel="See all deals">
    <Text>See all deals →</Text>
  </Pressable>
</A11y.View>
```

Landmark regions are reachable via the VoiceOver rotor's "Landmarks" category.

### Group

```tsx
<A11y.View
  a11yUIContainer="group"
  accessibilityLabel="Order summary. Subtotal $18.50. Tax $1.85. Total $20.35."
>
  <View style={summaryStyles}>
    <Text>Subtotal</Text>
    <Text>$18.50</Text>
  </View>
  <View style={summaryStyles}>
    <Text>Total</Text>
    <Text>$20.35</Text>
  </View>
</A11y.View>
```

## Usage with A11y.Index

If an ordered element also needs container semantics, use `a11yUIContainer` directly on
`A11y.Index`:

```tsx
<A11y.Order>
  <A11y.Index index={1} a11yUIContainer="list">
    {items.map((item) => (
      <View key={item.id} accessible accessibilityLabel={item.label}>
        <Text>{item.label}</Text>
      </View>
    ))}
  </A11y.Index>
</A11y.Order>
```

## Notes

- This prop is iOS only. On Android it has no effect.
- Setting `accessibilityLabel` on the `A11y.View` wrapper provides the container name
  VoiceOver reads on entry.
- `importantForAccessibility="no"` can be used on the wrapper to prevent VoiceOver from
  focusing the container itself, forcing it to navigate directly to children.

## Related

- [Screen-reader focus order](./a11y-order.md)
- [Component overview → A11y.View](../components/overview.md#a11yview)

---

← [Focus lock](./focus-lock.md) · [Announcements →](./announcements.md)
