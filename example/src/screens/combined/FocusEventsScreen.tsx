import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  A11y,
  KeyboardOrderFocusGroup,
  type ScreenReaderDescendantFocusChangedEvent,
} from 'react-native-a11y';
import { Screen } from '../../components';

const alpha = 'α';
const beta = 'β';
const gamma = 'γ';

const SYMBOL_COLORS: Record<string, string> = {
  [alpha]: '#2563eb',
  [beta]: '#059669',
  [gamma]: '#d97706',
};

// Darker shade of each color block, used as its keyboard-focus ring so the
// indicator reads against the block's own (already colored) background.
const COLOR_RING: Record<string, string> = {
  Red: '#991b1b',
  Green: '#15803d',
  Blue: '#1d4ed8',
};

type Source = 'Screen reader' | 'Keyboard';

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

/**
 * Focus-event tracker — the merged `A11y.View` fires screen-reader sub-view events
 * AND keyboard focus events on the same element, so each tracked control reports
 * focus/blur from either source. The custom order drives both VoiceOver/TalkBack
 * traversal and hardware-keyboard Tab order.
 */
export const FocusEventsScreen = () => {
  const [focused, setFocused] = React.useState('—');
  const [blurred, setBlurred] = React.useState('—');
  const [source, setSource] = React.useState<Source | '—'>('—');
  const [info, setInfo] = React.useState('—');
  // Which element currently holds hardware-keyboard focus (drives the custom
  // focus ring, since A11y.View/Index style via the native halo, not focusStyle).
  const [kbFocus, setKbFocus] = React.useState<string | null>(null);

  const trackFocus = useCallback((label: string, src: Source) => {
    setFocused(label);
    setSource(src);
  }, []);
  const trackBlur = useCallback((label: string) => setBlurred(label), []);

  // onFocusChange handler that records keyboard focus AND toggles the ring.
  const keyboardFocus = useCallback(
    (label: string) => (isFocused: boolean) => {
      if (isFocused) {
        trackFocus(label, 'Keyboard');
        setKbFocus(label);
      } else {
        trackBlur(label);
        setKbFocus((cur) => (cur === label ? null : cur));
      }
    },
    [trackFocus, trackBlur]
  );

  const onDescendantChanged = useCallback(
    (e: ScreenReaderDescendantFocusChangedEvent) => {
      setInfo(JSON.stringify(e.nativeEvent));
    },
    []
  );

  return (
    <Screen
      title="Focus events"
      description="Navigate with a screen reader or Tab with a hardware keyboard — focus/blur callbacks fire from both, and the tracker shows the source."
    >
      {/* Tracked card — SR sub-view focus + keyboard focus */}
      <A11y.View
        focusable
        tintType="none"
        onScreenReaderSubViewFocused={() =>
          trackFocus('Header', 'Screen reader')
        }
        onScreenReaderSubViewBlurred={() => trackBlur('Header')}
        onFocusChange={keyboardFocus('Header')}
      >
        <View
          accessible
          style={[styles.card, kbFocus === 'Header' && styles.cardFocused]}
        >
          <View style={styles.cardAccent} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Focus and blur events</Text>
            <Text style={styles.cardDesc}>
              Focus this element — watch the tracker update below
            </Text>
          </View>
        </View>
      </A11y.View>

      {/* Reordered symbols: visual β α γ → focus α β γ (SR + keyboard) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom focus order</Text>
        <Text style={styles.sectionSub}>
          Visual order: β α γ · Focus order: α → β → γ
        </Text>
        <View collapsable={false} style={styles.symbolsWrapper}>
          {/* KeyboardOrderFocusGroup makes Tab follow the same index order */}
          <KeyboardOrderFocusGroup>
            <A11y.Order style={styles.symbols}>
              {[
                { sym: beta, index: 1, label: 'Focus 2' },
                { sym: alpha, index: 0, label: 'Focus 1' },
                { sym: gamma, index: 2, label: 'Focus 3' },
              ].map(({ sym, index, label }) => (
                <A11y.Index
                  key={sym}
                  index={index}
                  focusable
                  tintType="none"
                  onScreenReaderSubViewFocused={() =>
                    trackFocus(sym, 'Screen reader')
                  }
                  onScreenReaderSubViewBlurred={() => trackBlur(sym)}
                  onFocusChange={keyboardFocus(sym)}
                >
                  <View
                    style={[
                      styles.symbolBtn,
                      { borderColor: SYMBOL_COLORS[sym] },
                      kbFocus === sym && {
                        borderWidth: 4,
                        backgroundColor: `${SYMBOL_COLORS[sym]}1a`,
                      },
                    ]}
                    accessible
                    accessibilityLabel={`Symbol ${sym}`}
                  >
                    <Text
                      aria-hidden
                      style={[styles.symbolText, { color: SYMBOL_COLORS[sym] }]}
                    >
                      {sym}
                    </Text>
                    <Text aria-hidden style={styles.symbolOrder}>
                      {label}
                    </Text>
                  </View>
                </A11y.Index>
              ))}
            </A11y.Order>
          </KeyboardOrderFocusGroup>
        </View>
      </View>

      {/* Color squares with descendant focus tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descendant focus tracking</Text>
        <Text style={styles.sectionSub}>
          Each color fires a descendant focus change event
        </Text>
        <A11y.View
          onScreenReaderDescendantFocusChanged={onDescendantChanged}
          onScreenReaderSubViewFocused={() =>
            trackFocus('Colors', 'Screen reader')
          }
          onScreenReaderSubViewBlurred={() => trackBlur('Colors')}
          accessibilityLabel="Colors"
          style={styles.colors}
        >
          {[
            { id: 'Red', color: '#ef4444', label: 'Red' },
            { id: 'Green', color: '#22c55e', label: 'Green' },
            { id: 'Blue', color: '#3b82f6', label: 'Blue' },
          ].map((c) => (
            <A11y.View
              key={c.id}
              nativeID={c.id}
              focusable
              tintType="none"
              accessibilityLabel={`${c.label} Color`}
              style={[
                styles.colorBlock,
                { backgroundColor: c.color },
                kbFocus === c.label && {
                  borderWidth: 3,
                  borderColor: COLOR_RING[c.id],
                },
              ]}
              accessible
              onFocusChange={keyboardFocus(c.label)}
            >
              <Text style={styles.colorLabel}>{c.label}</Text>
            </A11y.View>
          ))}
        </A11y.View>
      </View>

      {/* Live tracker panel */}
      <View style={styles.monitor}>
        <Text style={styles.monitorTitle}>Live Tracker</Text>
        <Row label="Focused" value={focused} />
        <View style={styles.divider} />
        <Row label="Source" value={source} />
        <View style={styles.divider} />
        <Row label="Blurred" value={blurred} />
        <View style={styles.divider} />
        <Row label="Info" value={info} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardFocused: { borderColor: '#dc2626', borderWidth: 2 },
  cardAccent: { width: 5, backgroundColor: '#dc2626' },
  cardBody: { flex: 1, padding: 16, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 13, color: '#64748b' },

  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  sectionSub: { fontSize: 12, color: '#64748b' },

  symbolsWrapper: { alignItems: 'center' },
  symbols: { flexDirection: 'row', gap: 12, padding: 4 },
  symbolBtn: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    gap: 4,
  },
  symbolText: { fontSize: 28, fontWeight: '700' },
  symbolOrder: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },

  colors: { flexDirection: 'row', gap: 10 },
  colorBlock: {
    flex: 1,
    height: 80,
    borderRadius: 14,
    justifyContent: 'flex-end',
    padding: 10,
    // Reserve the focus ring so toggling it doesn't reflow the row.
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorLabel: { fontSize: 13, fontWeight: '700', color: '#ffffff' },

  monitor: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  monitorTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  rowLabel: { fontSize: 13, fontWeight: '600', color: '#94a3b8', width: 70 },
  rowValue: { fontSize: 13, color: '#e2e8f0', flex: 1 },
  divider: { height: 1, backgroundColor: '#1e293b' },
});
