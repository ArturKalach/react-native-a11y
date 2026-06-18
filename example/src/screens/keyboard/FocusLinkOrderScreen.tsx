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
 * Same spiral layout as the index-order screen, but the Tab sequence is built
 * from explicit per-cell links: every cell names the `orderId` of the next and
 * previous cell via `orderForward` / `orderBackward`. The chain wraps, so the
 * last cell loops back to the first.
 */
const GRID = [
  [1, 2, 3],
  [8, 9, 4],
  [7, 6, 5],
];

const COUNT = GRID.flat().length;
const cellId = (n: number) => `cell-${n}`;

/**
 * `lockFocus` blocks arrow-key focus movement in the given directions, so the
 * arrow keys follow the spiral instead of the geometric grid. Each cell allows
 * only the directions toward its sequence neighbours; everything else is locked
 * (e.g. cell 7 → `['down', 'left']`). Same layout as the index-order screen.
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

/** A11y.Pressable + orderId/orderForward/orderBackward — a hand-wired focus chain. */
export const FocusLinkOrderScreen = () => {
  const ref = useRef<KeyboardFocus>(null);

  return (
    <Screen
      title="Keyboard link order"
      description="Each cell explicitly links to the next and previous cell via orderForward / orderBackward IDs. Tab follows the spiral chain and loops at the end."
    >
      <Card label="Link order (orderForward / orderBackward)">
        <KeyboardOrderFocusGroup>
          <View style={styles.grid}>
            {GRID.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((n) => {
                  // Wrap the chain: 1 ⇆ 2 ⇆ … ⇆ 9 ⇆ back to 1.
                  const next = (n % COUNT) + 1;
                  const prev = ((n - 2 + COUNT) % COUNT) + 1;
                  return (
                    <A11y.Pressable
                      key={n}
                      ref={n === 1 ? ref : undefined}
                      orderId={cellId(n)}
                      orderForward={cellId(next)}
                      orderBackward={cellId(prev)}
                      lockFocus={LOCKS[n]}
                      onPress={() => ref.current?.focus()}
                      style={styles.cell}
                      focusStyle={FOCUS_STYLE}
                      // Green `focusStyle` border is the only intended indicator.
                      // On iOS the system halo is controlled by `haloEffect` (not
                      // `defaultFocusHighlightEnabled`), so disable it explicitly —
                      // the persistent cell border otherwise makes RN toggle
                      // cornerRadius and the system halo blinks through.
                      haloEffect={false}
                      defaultFocusHighlightEnabled={false}
                    >
                      <Text style={styles.cellIndex}>{n}</Text>
                      <Text style={styles.cellArrow}>→ {next}</Text>
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
  cellArrow: { fontSize: 12, color: '#94a3b8' },
});
