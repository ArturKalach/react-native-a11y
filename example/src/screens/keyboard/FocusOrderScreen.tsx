import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  A11y,
  KeyboardOrderFocusGroup,
  type KeyboardFocus,
  type FocusStyle,
  type LockFocusType,
} from 'react-native-a11y';
import { Card, Screen } from '../../components';

/**
 * Visual grid laid out so that walking the cells in index order (the number on
 * each cell) traces a spiral. `orderIndex` drives Tab / Shift+Tab order
 * independently of the on-screen row/column position.
 */
const GRID = [
  [1, 2, 3],
  [8, 9, 4],
  [7, 6, 5],
];

/**
 * `lockFocus` blocks arrow-key focus movement in the given directions, so the
 * arrow keys follow the spiral instead of the geometric grid. Each cell allows
 * only the directions toward its sequence neighbours; everything else is locked
 * (e.g. cell 7 → `['down', 'left']`). Keyed by the cell number.
 */
const LOCKS: Record<number, LockFocusType[]> = {
  1: ['up', 'down', 'left'],
  2: ['up', 'down'],
  3: ['up', 'right'],
  4: ['left', 'right'],
  5: ['down', 'right'],
  6: ['up', 'down'],
  7: ['down', 'left'],
  8: ['up', 'left'],
  9: ['up', 'down', 'right'],
};

const FOCUS_STYLE: FocusStyle = {
  borderColor: '#22c55e',
  borderWidth: 2,
};

/** A11y.Pressable + orderIndex — Tab cycles cells in numeric order, not layout order. */
export const FocusOrderScreen = () => {
  const ref = useRef<KeyboardFocus>(null);

  return (
    <Screen
      title="Focus order (keyboard/screen reader)"
      description="orderIndex sets the Tab / Shift+Tab sequence. Cells are arranged in a spiral so index order differs from layout order. Connect a hardware keyboard and Tab through."
    >
      <Card label="Index order (orderIndex)">
        <KeyboardOrderFocusGroup>
          <View style={styles.grid}>
            {GRID.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((n) => {
                  const isFirst = n === 1;
                  const isLast = n === GRID.flat().length;
                  return (
                    <A11y.Pressable
                      key={n}
                      ref={isFirst ? ref : undefined}
                      orderIndex={n - 1}
                      // Loop: the last cell tabs back to the first.
                      orderId={isFirst ? 'start' : isLast ? 'end' : undefined}
                      orderForward={isLast ? 'start' : undefined}
                      orderBackward={isFirst ? 'end' : undefined}
                      onPress={() => ref.current?.focus()}
                      lockFocus={LOCKS[n]}
                      style={styles.cell}
                      // focusable={n != 2}
                      // importantForAccessibility={n == 3 ? 'no-hide-descendants' : undefined}
                      focusStyle={FOCUS_STYLE}
                      // The green `focusStyle` border is the only intended focus
                      // indicator. On iOS the system halo is controlled by
                      // `haloEffect` (not `defaultFocusHighlightEnabled`), so turn
                      // it off explicitly — otherwise the persistent cell border
                      // makes RN toggle cornerRadius and the system halo blinks.
                      tintType="none"
                      // haloEffect={false}
                      // defaultFocusHighlightEnabled={false}
                    >
                      <Text style={styles.cellIndex}>{n}</Text>
                      <Text style={styles.cellLabel}>order {n}</Text>
                    </A11y.Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </KeyboardOrderFocusGroup>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  grid: { gap: 10, alignSelf: 'center' },
  row: { flexDirection: 'row', gap: 10 },
  cell: {
    width: 88,
    height: 88,
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#c7d2fe',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cellIndex: { fontSize: 30, fontWeight: '800', color: '#4f46e5' },
  cellLabel: { fontSize: 12, color: '#94a3b8' },
});
