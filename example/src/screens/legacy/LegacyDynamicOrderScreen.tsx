import { useCallback, useEffect, useState } from 'react';
import {
  findNodeHandle,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Legacy } from 'react-native-a11y';
import { Card, Screen } from '../../components';

/**
 * Legacy 0.7 dynamic order. `registerOrder(i)` produces ref callbacks; each row
 * keeps a fixed, unique slot, so the reader order is stable while rows are
 * added/removed. Reading order (by slot) differs from visual order, and adding
 * the "Extra" row slots it in at the end. Also shows `Legacy.useCombinedRef`
 * (keep your own ref *and* register it) and `Legacy.setAccessibilityFocus`.
 */
export const LegacyDynamicOrderScreen = () => {
  const [showExtra, setShowExtra] = useState(true);
  const { a11yOrder, registerOrder, setOrder } =
    Legacy.useDynamicFocusOrder<View>();

  // Keep a ref to the first row AND register it for ordering (slot 0).
  const [firstRef, firstRefCallback] = Legacy.useCombinedRef<View>(
    registerOrder(0)
  );

  // Re-apply the order after the set of rendered rows changes.
  useEffect(setOrder, [showExtra, setOrder]);

  const focusFirst = useCallback(() => {
    const tag = findNodeHandle(firstRef.current);
    if (tag) {
      Legacy.setAccessibilityFocus(tag);
    }
  }, [firstRef]);

  return (
    <Screen
      title="Legacy dynamic order"
      description="Each row keeps a fixed slot, so the reader order is stable as rows are added/removed. Turn on VoiceOver/TalkBack and toggle the Extra row."
    >
      <Card label="Legacy.useDynamicFocusOrder + useCombinedRef">
        <Legacy.A11yOrder a11yOrder={a11yOrder} style={styles.group}>
          <View ref={firstRefCallback} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #1 — read 1st</Text>
          </View>
          <View ref={registerOrder(2)} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #2 — read 3rd</Text>
          </View>
          <View ref={registerOrder(1)} accessible style={styles.item}>
            <Text style={styles.itemText}>Visually #3 — read 2nd</Text>
          </View>
          {showExtra ? (
            <View ref={registerOrder(3)} accessible style={styles.itemExtra}>
              <Text style={styles.itemText}>Extra — read last</Text>
            </View>
          ) : null}
        </Legacy.A11yOrder>

        <Pressable style={styles.btn} onPress={() => setShowExtra((v) => !v)}>
          <Text style={styles.btnText}>
            {showExtra ? 'Remove Extra row' : 'Add Extra row'}
          </Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnAlt]} onPress={focusFirst}>
          <Text style={styles.btnText}>Move reader focus to #1</Text>
        </Pressable>
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
  itemExtra: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e6f4ea',
    borderRadius: 8,
  },
  itemText: { fontSize: 16, color: '#111' },
  btn: {
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#2b6cb0',
    alignItems: 'center',
  },
  btnAlt: { backgroundColor: '#4a5568' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
