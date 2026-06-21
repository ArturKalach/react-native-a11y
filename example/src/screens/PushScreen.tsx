import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../components';
import { usePushMode } from '../navigation/pushMode';

const PUSH_TEST = 'push-test';

/**
 * Stack-push playground. `navigation.push` adds a NEW instance of a route (unlike
 * `navigate`, which reuses an existing one), so you can stack the same screens
 * over and over and walk back through every instance. Bump the counter, push a
 * few screens, then pop back and confirm this instance's state is intact.
 */
export const PushScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<Record<string, undefined>>>();
  const depth = useNavigationState((state) => state.index);
  const [count, setCount] = useState(0);
  const { enabled, setEnabled } = usePushMode();

  const pushRandom = () => {
    const names = navigation
      .getState()
      .routeNames.filter((name) => name !== 'Home');
    const name = names[Math.floor(Math.random() * names.length)];
    if (name) navigation.push(name);
  };

  return (
    <Screen
      title="Push test"
      description="push() stacks a fresh screen instance each time. Push screens (including this one) to exercise features at depth, then go back to verify each instance still works and kept its state."
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>This instance</Text>
            <Text style={styles.cardDesc}>
              Stack depth <Text style={styles.bold}>{depth}</Text>. Each push
              adds a level; the header back arrow (or Prev) pops one.
            </Text>
            <View style={styles.counterRow}>
              <Text style={styles.counterLabel}>Local counter</Text>
              <Text style={styles.counterValue}>{count}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setCount((c) => c + 1)}
                accessibilityRole="button"
                accessibilityLabel="Increment counter"
              >
                <Text style={styles.counterBtnText}>+1</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
              Increment, push, then pop back — this number should be unchanged.
            </Text>
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Footer push button</Text>
            <Text style={styles.hint}>
              Adds a Push button between Prev and Next on every screen, so you
              can recurse from anywhere.
            </Text>
          </View>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={pushRandom}
          accessibilityRole="button"
          accessibilityLabel="Push a random screen"
        >
          <Text style={styles.btnText}>Push random screen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnPurple]}
          onPress={() => navigation.push(PUSH_TEST)}
          accessibilityRole="button"
          accessibilityLabel="Push this screen again"
        >
          <Text style={styles.btnText}>Push this screen again</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16 },
  bold: { fontWeight: '700', color: '#1e293b' },

  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardAccent: { width: 5, backgroundColor: '#7c3aed' },
  cardBody: { flex: 1, padding: 16, gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },

  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', flex: 1 },
  counterValue: { fontSize: 20, fontWeight: '800', color: '#7c3aed' },
  counterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ede9fe',
  },
  counterBtnText: { fontSize: 15, fontWeight: '700', color: '#7c3aed' },
  hint: { fontSize: 12, color: '#94a3b8' },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  toggleInfo: { flex: 1, gap: 4 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },

  btn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPurple: { backgroundColor: '#7c3aed' },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
});
