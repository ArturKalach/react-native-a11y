# Legacy API — `Legacy.*`

The `Legacy` namespace is a **backward-compatibility shim** for the *imperative*
focus-order API from `react-native-a11y@0.7`. It exists only to ease migration and is a
candidate for removal in a future major.

```tsx
import { Legacy } from 'react-native-a11y';
```

> [!IMPORTANT]
> For new code, prefer the modern declarative APIs:
> - Screen-reader order → [`A11y.Order` / `A11y.Index`](../guides/a11y-order.md)
> - Keyboard order → [`order*` props](../guides/focus-order.md)
> - Programmatic focus → the [`KeyboardFocus` ref](./overview.md#imperative-ref-keyboardfocus)
>   and `A11y.Index`'s `focus()`
>
> `Legacy.*` reimplements the old hooks on the new native order primitive, so behavior
> matches 0.7 closely but is not extended.

## `Legacy.useFocusOrder`

Imperative order hook for a **fixed** number of children. Returns a stable `refs` array —
attach `refs[i]` to each child and spread `a11yOrder` onto the wrapping `Legacy.A11yOrder`.

```ts
function useFocusOrder<T>(size: number): {
  a11yOrder: { ref: RefObject<View>; onLayout: () => void };
  refs: RefCallback<T>[];
  reset: () => void;
  setOrder: () => void;
};
```

```tsx
const { a11yOrder, refs } = Legacy.useFocusOrder(2);

<Legacy.A11yOrder {...a11yOrder}>
  <View ref={refs[0]}><Text>First</Text></View>
  <View ref={refs[1]}><Text>Second</Text></View>
</Legacy.A11yOrder>
```

## `Legacy.useDynamicFocusOrder`

Variant for a **dynamic** number of children. Returns `registerOrder(order)` to create a
ref callback per element, plus `reset` / `setOrder`.

```ts
function useDynamicFocusOrder<T>(): {
  a11yOrder: { ref: RefObject<View>; onLayout: () => void };
  registerOrder: (order: number) => RefCallback<T>;
  reset: () => void;
  setOrder: () => void;
};
```

## `Legacy.A11yOrder`

The companion container `View` that the imperative hooks drive. Spread the hook's
`a11yOrder` object onto it.

## Imperative focus helpers (tag-based)

Move focus by native tag. Wrap a `ref` with `findNodeHandle(ref.current)` to obtain a
`nativeTag` when migrating from the old ref-based `A11yModule` API.

| Function | Description |
| :-- | :-- |
| `Legacy.setAccessibilityFocus(nativeTag)` | Move screen-reader (VoiceOver / TalkBack) focus to the view. |
| `Legacy.setKeyboardFocus(nativeTag)` | Move physical-keyboard focus to the view (forces a focus update). |
| `Legacy.setPreferredKeyboardFocus(nativeTag)` | Mark the view as the preferred keyboard-focus target (no forced update). |

```tsx
import { findNodeHandle } from 'react-native';
import { Legacy } from 'react-native-a11y';

const tag = findNodeHandle(ref.current);
if (tag) Legacy.setKeyboardFocus(tag);
```

## Ref utilities

| Function | Description |
| :-- | :-- |
| `Legacy.useCombinedRef(...refs)` | Hook that combines multiple refs into one. |
| `Legacy.combineRefs(...refs)` | Utility form (also exported at top level as `combineRefs`). |

## Migrating off `Legacy.*`

See the [migration guide → From legacy `react-native-a11y` 0.7](../migration/migration.md#from-legacy-react-native-a11y-07)
for the find/replace from the old top-level `useFocusOrder` / `useDynamicFocusOrder` to
`Legacy.*`, and the recommended move to the declarative APIs.

---

← [API reference](./overview.md) · [Migration guide →](../migration/migration.md)
