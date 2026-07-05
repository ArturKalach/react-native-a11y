import React from 'react';
import { memo, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { A11y, useIsViewFocused, useIsViewPressed } from 'react-native-a11y';
import { Screen } from '../../components';

/**
 * A11y.Pressable declaration playground.
 *
 * Each card below wires `A11y.Pressable` a *different* way so we can compare how
 * each declaration form drives re-renders. Every variant lives in its own
 * `memo()`'d component and shows a live render counter (also `console.log`ged),
 * so focusing / pressing a button shows exactly which parts re-render.
 *
 * The axes that matter (see `withKeyboardFocus` `reactToFocus`):
 *   - static style + static children ...... host never re-renders on focus
 *   - `useIsViewFocused` in a child ........ only the child re-renders, not host
 *   - function `style` ..................... host re-renders (styles inner comp)
 *   - function `containerStyle` ............ host re-renders + tracks touch press
 *   - `renderContent` / function children .. content re-renders with focus/press
 *   - halo + rounded style ................. native halo on + rounded focus/press
 *   - context focus + native pressed ....... optimal like button, host never re-renders
 *   - press store (useIsViewPressed) ....... press-reactive container, host flat
 *
 * To add your own logs: drop a `console.log` (or breakpoint) inside any variant
 * body, or extend `useRenderCount`.
 */

// ── render instrumentation ──────────────────────────────────────────────────

/**
 * Counts renders of the calling component and returns the live count.
 * The `console.log` runs in a commit-phase effect (not during render) so each
 * log corresponds to a *committed* render — a discarded render won't log, and
 * there's no render-phase side effect to confound the measurement.
 */
const useRenderCount = (label: string) => {
  const count = useRef(0);
  count.current += 1;
  useEffect(() => {
    console.log(`[render] ${label} #${count.current}`);
  });
  return count.current;
};

/** Small pill showing "<label> · N renders". */
const RenderBadge = ({ label, count }: { label: string; count: number }) => (
  <Text style={styles.badge}>
    {label} · {count} render{count === 1 ? '' : 's'}
  </Text>
);

// ── content pieces (defined once, referentially stable) ──────────────────────

/** Inner content that reads focus from context — re-renders WITHOUT the host. */
const ContextContent = () => {
  const focused = useIsViewFocused();
  const renders = useRenderCount('Context child');
  return (
    <View style={styles.inner}>
      <Text style={styles.innerText}>useIsViewFocused → {String(focused)}</Text>
      <RenderBadge label="child" count={renders} />
    </View>
  );
};

/** renderContent render-prop — invoked by the wrapped component with its state. */
const renderContentFn = ({
  focused,
  pressed,
}: {
  focused: boolean;
  pressed?: boolean;
}) => (
  <View
    style={[
      styles.inner,
      focused && styles.innerFocused,
      pressed && styles.innerPressed,
    ]}
  >
    <Text style={styles.innerText}>
      renderContent focused={String(focused)} pressed={String(!!pressed)}
    </Text>
  </View>
);

// ── declaration variants ─────────────────────────────────────────────────────
// Each is memo()'d so its re-renders are isolated and observable.

/** A — fully static. Host never re-renders on focus; native halo shows focus. */
const StaticVariant = memo(() => {
  const renders = useRenderCount('A static host');
  return (
    <A11y.Pressable testID="pressable-a-static" style={styles.card}>
      <View style={styles.inner}>
        <Text style={styles.innerText}>static style + static children</Text>
        <RenderBadge label="host" count={renders} />
      </View>
    </A11y.Pressable>
  );
});

/** B — focus consumed by a child via context. Only the child re-renders. */
const ContextVariant = memo(() => {
  const renders = useRenderCount('B context host');
  return (
    <A11y.Pressable testID="pressable-b-context" style={styles.card}>
      <RenderBadge label="host" count={renders} />
      <ContextContent />
    </A11y.Pressable>
  );
});

/** C — function `style`. Host re-renders; styles the inner (wrapped) component. */
const StyleFnVariant = memo(() => {
  const renders = useRenderCount('C style-fn host');
  return (
    <A11y.Pressable
      testID="pressable-c-style-fn"
      style={({ focused, pressed }) => [
        styles.card,
        focused && styles.cardFocused,
        pressed && styles.cardPressed,
      ]}
      tintType="none"
    >
      <View style={styles.inner}>
        <Text style={styles.innerText}>
          style=({'{focused,pressed}'}) =&gt; …
        </Text>
        <RenderBadge label="host" count={renders} />
      </View>
    </A11y.Pressable>
  );
});

/** D — function `containerStyle`. Host re-renders + tracks touch press. */
const ContainerStyleFnVariant = memo(() => {
  const renders = useRenderCount('D container-fn host');
  return (
    <A11y.Pressable
      testID="pressable-d-container-fn"
      style={styles.card}
      tintType="none"
      containerStyle={({
        focused,
        pressed,
      }: {
        focused: boolean;
        pressed: boolean;
      }) => [
        styles.container,
        focused && styles.containerFocused,
        pressed && styles.containerPressed,
      ]}
    >
      <View style={styles.inner}>
        <Text style={styles.innerText}>containerStyle=(…) =&gt; …</Text>
        <RenderBadge label="host" count={renders} />
      </View>
    </A11y.Pressable>
  );
});

/**
 * E — `renderContent` render prop. The host badge sits *outside* the Pressable:
 * `renderContent` overrides `children`, so a badge passed as children would be
 * dropped. `renderContentFn` is module-level (stable) — the recommended form.
 */
const RenderContentVariant = memo(() => {
  const renders = useRenderCount('E renderContent host');
  return (
    <View style={styles.section}>
      <A11y.Pressable
        testID="pressable-e-render-content"
        style={styles.card}
        renderContent={renderContentFn}
      />
      <RenderBadge label="host" count={renders} />
    </View>
  );
});

/**
 * F — function children (Pressable's native render-prop children). Note: native
 * `children` only gets `pressed` — for `focused` use `renderContent` (variant E)
 * or the context path (variant B).
 */
const ChildrenFnVariant = memo(() => {
  const renders = useRenderCount('F children-fn host');
  return (
    <A11y.Pressable testID="pressable-f-children-fn" style={styles.card}>
      {({ pressed }: { pressed: boolean }) => (
        <View style={[styles.inner, pressed && styles.innerPressed]}>
          <Text style={styles.innerText}>
            children=({'{pressed}'}) =&gt; … (no focused)
          </Text>
          <RenderBadge label="host" count={renders} />
        </View>
      )}
    </A11y.Pressable>
  );
});

/**
 * G — native halo (on) + rounded JS style on focus/press. `haloCornerRadius`
 * rounds the native halo; the function `style` adds a rounded highlight for both
 * `focused` and `pressed` (a static `focusStyle` can't cover press).
 */
const FocusStyleVariant = memo(() => {
  const renders = useRenderCount('G rounded host');
  return (
    <A11y.Pressable
      testID="pressable-g-halo-rounded"
      haloCornerRadius={24}
      style={({ focused, pressed }) => [
        styles.card,
        (focused || pressed) && styles.rounded,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.inner}>
        <Text style={styles.innerText}>halo + rounded focus/press style</Text>
        <RenderBadge label="host" count={renders} />
      </View>
    </A11y.Pressable>
  );
});

/**
 * A real "like" button. Focus comes from the context store, press from the
 * Pressable's function children — so the border and heart recolor on focus/press
 * WITHOUT re-rendering the host (that work `tintType="none"` removed from the
 * native halo now lives here in JS). This is the only piece that re-renders.
 */
const LikeButton = ({ pressed }: { pressed: boolean }) => {
  const focused = useIsViewFocused();
  const renders = useRenderCount('J like button');
  // filled + red on press, tinted on focus, muted outline at rest
  const heartColor = pressed ? '#ff2d55' : focused ? '#ff8fab' : '#c7c7cc';
  return (
    <View style={styles.likeWrap}>
      <View
        style={[
          styles.like,
          focused && styles.likeFocused,
          pressed && styles.likePressed,
        ]}
      >
        <Text style={[styles.heart, { color: heartColor }]}>
          {pressed ? '♥' : '♡'}
        </Text>
        <Text style={styles.likeLabel}>Like</Text>
      </View>
      <RenderBadge label="likeBtn" count={renders} />
    </View>
  );
};

/**
 * J — the performance-optimal pattern, shown as a real like button. The host
 * NEVER re-renders on focus or press: `focused` comes from the context store
 * (only `LikeButton` re-renders) and `pressed` comes from the native Pressable's
 * function children (RN re-renders only its own subtree). `tintType="none"`
 * drops the native halo; `containerStyle` is a *static* frame (a function
 * `containerStyle` would re-render the host — see variant D).
 */
const OptimalVariant = memo(() => {
  // Counter kept for the console log — host renders stay flat on focus/press.
  useRenderCount('J optimal host');
  return (
    <A11y.Pressable
      testID="pressable-j-like"
      tintType="none"
      style={styles.card}
      containerStyle={styles.optimalContainer}
      accessibilityRole="button"
      accessibilityLabel="Like"
    >
      {({ pressed }: { pressed: boolean }) => <LikeButton pressed={pressed} />}
    </A11y.Pressable>
  );
});

/**
 * The container-looking box for variant K. It reads BOTH focus and press from
 * the context stores (`useIsViewFocused` / `useIsViewPressed`) — so it recolors
 * its border on focus and press without the host ever re-rendering. This is the
 * D pattern (press-reactive container) done optimally: press covers touch *and*
 * physical keyboard, unlike J's function-children (touch only).
 */
const PressStoreBox = () => {
  const focused = useIsViewFocused();
  const pressed = useIsViewPressed();
  const renders = useRenderCount('K press-store child');
  return (
    <View
      style={[
        styles.card,
        focused && styles.cardFocused,
        pressed && styles.cardPressed,
      ]}
    >
      <Text style={styles.innerText}>
        useIsViewPressed={String(pressed)} · focused={String(focused)}
      </Text>
      <RenderBadge label="child" count={renders} />
    </View>
  );
};

/**
 * K — press-reactive container via the press store. The Pressable has a static
 * `style` (no function style/containerStyle), so the host NEVER re-renders; the
 * child `PressStoreBox` re-renders on focus/press by subscribing to the stores.
 * Compare to variant D, which re-renders the whole host on every press.
 */
const PressStoreVariant = memo(() => {
  // Counter kept for the console log — host renders stay flat on focus/press.
  useRenderCount('K press-store host');
  return (
    <A11y.Pressable testID="pressable-k-press-store" tintType="none">
      <PressStoreBox />
    </A11y.Pressable>
  );
});

const VARIANTS: {
  key: string;
  title: string;
  Component: React.ComponentType;
}[] = [
  { key: 'A', title: 'A · Static (baseline)', Component: StaticVariant },
  { key: 'B', title: 'B · useIsViewFocused child', Component: ContextVariant },
  { key: 'C', title: 'C · function style', Component: StyleFnVariant },
  {
    key: 'D',
    title: 'D · function containerStyle',
    Component: ContainerStyleFnVariant,
  },
  { key: 'E', title: 'E · renderContent', Component: RenderContentVariant },
  { key: 'F', title: 'F · function children', Component: ChildrenFnVariant },
  {
    key: 'G',
    title: 'G · halo + rounded focus/press',
    Component: FocusStyleVariant,
  },
  {
    key: 'J',
    title: 'J · optimal like button (context focus + native pressed)',
    Component: OptimalVariant,
  },
  {
    key: 'K',
    title: 'K · press-reactive container (press store, host flat)',
    Component: PressStoreVariant,
  },
];

export const PressableStyledScreen = () => (
  <Screen
    title="Pressable Testing Screen"
    description="Compare A11y.Pressable declaration forms and their re-render behavior. Watch the per-card render counts (also logged to the JS console) while focusing with a keyboard / pressing."
  >
    {VARIANTS.map(({ key, title, Component }) => (
      <View key={key} style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Component />
      </View>
    ))}
  </Screen>
);

const styles = StyleSheet.create({
  section: { gap: 8 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#3a3a3c' },

  // container = the A11yView wrapper (variant D styles this)
  container: { borderRadius: 12 },
  containerFocused: {
    backgroundColor: '#0a84ff14',
    borderColor: '#0a84ff',
    borderWidth: 2,
  },
  containerPressed: { opacity: 0.6 },

  // card = the wrapped Pressable
  card: {
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5ea',
    backgroundColor: '#ffffff',
    padding: 12,
    justifyContent: 'center',
    gap: 6,
  },
  cardFocused: { borderColor: '#0a84ff' },
  cardPressed: { backgroundColor: '#0a84ff28' },
  // Rounded highlight for focus/press; radius matches haloCornerRadius so the
  // native halo and the JS style round together.
  rounded: {
    borderRadius: 24,
    borderColor: '#0a84ff',
    backgroundColor: '#0a84ff14',
  },

  // Variant J: static container frame (no focus reaction → no host re-render).
  optimalContainer: { borderRadius: 12 },
  // Variant J: the like button. Border/heart recolor on focus/press here
  // (context + native pressed), so it stays prominent without a host re-render.
  likeWrap: { alignItems: 'flex-start', gap: 6 },
  like: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d1d6',
    backgroundColor: '#ffffff',
  },
  // White background stays; only the border color reacts to focus/press.
  likeFocused: { borderColor: '#0a84ff' },
  likePressed: { borderColor: '#ff2d55' },
  heart: { fontSize: 22 },
  likeLabel: { fontSize: 15, fontWeight: '600', color: '#1c1c1e' },

  inner: { gap: 4 },
  innerFocused: {},
  innerPressed: { opacity: 0.5 },
  innerText: { fontSize: 14, color: '#1c1c1e' },

  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontFamily: 'Courier',
    color: '#8e8e93',
  },
});
