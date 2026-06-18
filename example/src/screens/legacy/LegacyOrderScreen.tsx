import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Legacy } from 'react-native-a11y';
import { Card, Screen } from '../../components';

/**
 * Legacy 0.7 imperative order. Attach the numbered `refs[i]` to children and
 * spread `a11yOrder` onto `Legacy.A11yOrder`; visual order is #1 · #2 · #3 but
 * the screen reader traverses 1st → 2nd → 3rd via the ref slots.
 *
 * Modern equivalent: declarative `A11y.Order` + `A11y.Index` (see "Screen-reader
 * order").
 */
export const LegacyOrderScreen = () => {
  const { a11yOrder, refs, setOrder } = Legacy.useFocusOrder<View>(3);

  // Re-apply on mount (Legacy.A11yOrder also re-applies on layout).
  useEffect(setOrder, [setOrder]);

  return (
    <Screen
      title="Legacy focus order"
      description="react-native-a11y@0.7 imperative API. Turn on VoiceOver/TalkBack and swipe — reading order differs from visual order."
    >
      <Card label="Legacy.useFocusOrder + Legacy.A11yOrder">
        <Legacy.A11yOrder a11yOrder={a11yOrder} style={styles.group}>
          <View ref={refs[0]} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #1 — read 1st</Text>
          </View>
          <View ref={refs[2]} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #2 — read 3rd</Text>
          </View>
          <View ref={refs[1]} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #3 — read 2nd</Text>
          </View>
        </Legacy.A11yOrder>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  group: { gap: 8 },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  itemText: { fontSize: 16, color: '#111' },
});
