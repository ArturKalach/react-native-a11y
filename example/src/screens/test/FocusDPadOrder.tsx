import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  A11y,
  KeyboardOrderFocusGroup,
  type KeyboardFocus,
} from 'react-native-a11y';
import {
  ANDROID_FOCUS_STYLE,
  ANDROID_SECONDARY_FOCUS_STYLE,
} from '../../constants/focusStyles';

const list = ['0_0', '0_1', '0_2', '1_0', '1_1', '1_2', '2_0', '2_1', '2_2'];
const arrows = ['⇖', '⇑', '⇗', '⇐', '⊙', '⇒', '⇙', '⇓', '⇘'];
const arrowLabels = [
  '↖ top-left',
  '↑ up',
  '↗ top-right',
  '← left',
  '· all',
  '→ right',
  '↙ bot-left',
  '↓ down',
  '↘ bot-right',
];

/** Ported from react-native-external-keyboard's FocusDPadOrder (A11y.* API). */
export const FocusDPadOrder = () => {
  const [state, setState] = useState<number>(4);
  const role = () => {
    setState((i) => (i === list.length - 1 ? 0 : i + 1));
  };

  const ref = useRef<KeyboardFocus>(null);
  const onPress = () => {
    ref.current?.focus();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DPad Order</Text>
        <Text style={styles.description}>
          Arrow keys navigate between cells directionally. Press the center cell
          to change its link target.
        </Text>
      </View>
      <KeyboardOrderFocusGroup>
        <View style={styles.grid}>
          <View style={styles.row}>
            <A11y.Pressable
              orderId="0_0"
              orderDown="2_0"
              orderRight="0_2"
              onPress={onPress}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>◤</Text>
              <Text style={styles.cellLabel}>→ ↓</Text>
            </A11y.Pressable>
            <A11y.Pressable
              onPress={onPress}
              orderId="0_1"
              style={[styles.cell, styles.cellDim]}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </A11y.Pressable>
            <A11y.Pressable
              onPress={onPress}
              orderId="0_2"
              orderDown="2_2"
              orderLeft="0_0"
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>◥</Text>
              <Text style={styles.cellLabel}>← ↓</Text>
            </A11y.Pressable>
          </View>
          <View style={styles.row}>
            <A11y.Pressable
              onPress={onPress}
              orderId="1_0"
              style={[styles.cell, styles.cellDim]}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </A11y.Pressable>
            <A11y.Pressable
              ref={ref}
              orderLeft={list[state]}
              orderRight={list[state]}
              orderUp={list[state]}
              orderDown={list[state]}
              onPress={role}
              orderId="1_1"
              style={[styles.cell, styles.cellCenter]}
              focusStyle={ANDROID_SECONDARY_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellCenterArrow}>{arrows[state]}</Text>
              <Text style={styles.cellCenterLabel}>{arrowLabels[state]}</Text>
            </A11y.Pressable>
            <A11y.Pressable
              onPress={onPress}
              orderId="1_2"
              style={[styles.cell, styles.cellDim]}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </A11y.Pressable>
          </View>
          <View style={styles.row}>
            <A11y.Pressable
              orderId="2_0"
              orderUp="0_0"
              orderRight="2_2"
              onPress={onPress}
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>◣</Text>
              <Text style={styles.cellLabel}>↑ →</Text>
            </A11y.Pressable>
            <A11y.Pressable
              onPress={onPress}
              orderId="2_1"
              style={[styles.cell, styles.cellDim]}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>—</Text>
            </A11y.Pressable>
            <A11y.Pressable
              onPress={onPress}
              orderId="2_2"
              orderUp="0_2"
              orderLeft="2_0"
              style={styles.cell}
              focusStyle={ANDROID_FOCUS_STYLE}
              defaultFocusHighlightEnabled={false}
            >
              <Text style={styles.cellSymbol}>◢</Text>
              <Text style={styles.cellLabel}>↑ ←</Text>
            </A11y.Pressable>
          </View>
        </View>
      </KeyboardOrderFocusGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 20, padding: 16 },
  header: { alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1c1c1e' },
  description: {
    fontSize: 13,
    color: '#6b6b6b',
    textAlign: 'center',
    lineHeight: 18,
  },
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    width: 72,
    height: 72,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  cellDim: { backgroundColor: '#f2f2f7', shadowOpacity: 0, elevation: 0 },
  cellCenter: { backgroundColor: '#007AFF' },
  cellSymbol: { fontSize: 20, color: '#007AFF' },
  cellLabel: { fontSize: 10, color: '#8e8e93', fontWeight: '500' },
  cellCenterArrow: { fontSize: 24, color: '#ffffff' },
  cellCenterLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});
