import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
  type AccessibilityActionEvent,
} from 'react-native';
import { A11y, type A11yOptimisticConfig } from 'react-native-a11y';
import { Screen } from '../../components';

const PRIORITIES = ['Low', 'Medium', 'High'] as const;

// Simulated "loading" delay before the real state commits — wide enough that
// VoiceOver reads the value before React re-renders, exposing the stale read.
const DELAY_MS = 50;

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const ToggleRow = ({
  title,
  sub,
  value,
  onValueChange,
}: {
  title: string;
  sub: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) => (
  <View style={styles.toggleBar}>
    <View style={styles.toggleText}>
      <Text style={styles.toggleTitle}>{title}</Text>
      <Text style={styles.toggleSub}>{sub}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      accessibilityLabel={title}
    />
  </View>
);

/**
 * Optimistic accessibility values (iOS). On iOS VoiceOver reads an element's
 * `accessibilityValue` the instant an action fires — before React re-renders —
 * so without help it announces the *previous* value. The `optimistic` prop feeds
 * the *predicted next* value so VoiceOver speaks the right thing immediately.
 *
 * Every control here is an `A11y.Pressable`. Because the Pressable wraps its inner
 * component in a focusable `A11y.View`, the config is applied in wrapper-mode: the
 * inner focused element looks up its `A11y.View` host for the optimistic value.
 *
 * Test with VoiceOver on a device:
 *  • Checkbox / Switch — double-tap → hear the new state, not the stale one.
 *  • Priority — double-tap → hear the next priority immediately.
 *  • Quantity — swipe up / down → hear the next number immediately.
 */
export const OptimisticScreen = () => {
  const [checked, setChecked] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [priority, setPriority] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // Master switch — turn the `optimistic` prop on/off to A/B the same controls.
  const [optimisticEnabled, setOptimisticEnabled] = useState(false);
  // Simulate a slow state update so VoiceOver reads before the real value lands.
  const [delayEnabled, setDelayEnabled] = useState(false);

  const nextPriority = (priority + 1) % PRIORITIES.length;

  // Pass the config only when the master switch is on; otherwise undefined so the
  // control falls back to VoiceOver's default (stale) announcement.
  const opt = (
    config: A11yOptimisticConfig
  ): A11yOptimisticConfig | undefined =>
    optimisticEnabled ? config : undefined;

  // Commit a state change now, or after DELAY_MS when the delay sim is on.
  const commit = (fn: () => void) => {
    if (delayEnabled) {
      setTimeout(fn, DELAY_MS);
    } else {
      fn();
    }
  };

  // Shared adjustable handler: increment / decrement a counter setter.
  const adjust =
    (setter: Dispatch<SetStateAction<number>>) =>
    (event: AccessibilityActionEvent) => {
      const { actionName } = event.nativeEvent;
      if (actionName === 'increment') {
        commit(() => setter((q) => q + 1));
      } else if (actionName === 'decrement') {
        commit(() => setter((q) => Math.max(0, q - 1)));
      }
    };

  return (
    <Screen
      title="Optimistic values"
      description="iOS-only. VoiceOver announces the predicted value the moment you act, instead of the stale one. Toggle Optimistic off to hear the default (stale) behavior on the same A11y.Pressable controls."
    >
      {Platform.OS !== 'ios' && (
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Optimistic announcements are iOS-only — these controls still work,
            but the prop is a no-op on this platform.
          </Text>
        </View>
      )}

      {/* Master toggles — flip `optimistic` on/off and the simulated delay */}
      <ToggleRow
        title="Optimistic"
        sub={
          optimisticEnabled
            ? 'On — predicted value announced'
            : 'Off — VoiceOver reads the stale value'
        }
        value={optimisticEnabled}
        onValueChange={setOptimisticEnabled}
      />
      <ToggleRow
        title={`Delay (${DELAY_MS}ms)`}
        sub={
          delayEnabled
            ? 'On — state commits late, widening the stale window'
            : 'Off — state commits immediately'
        }
        value={delayEnabled}
        onValueChange={setDelayEnabled}
      />

      {/* state — checkbox toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>state · checkbox</Text>
        <Text style={styles.sectionSub}>
          optimistic={'{{'} state: {String(!checked)} {'}}'} — predicted next
          checked value
        </Text>
        <A11y.Pressable
          tintType="none"
          accessibilityRole="checkbox"
          accessibilityLabel="Email notifications"
          accessibilityState={{ checked }}
          optimistic={opt({ state: !checked })}
          onPress={() => commit(() => setChecked((c) => !c))}
          style={styles.control}
        >
          <View style={[styles.checkbox, checked && styles.checkboxOn]}>
            {checked && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.controlLabel}>Email notifications</Text>
        </A11y.Pressable>
      </View>

      {/* state — switch (role-aware: announced as on/off) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>state · switch</Text>
        <Text style={styles.sectionSub}>
          Switch role → announced “on” / “off” instead of checked / unchecked
        </Text>
        <A11y.Pressable
          tintType="none"
          accessibilityRole="switch"
          accessibilityLabel="Wi-Fi"
          accessibilityState={{ checked: enabled }}
          optimistic={opt({ state: !enabled })}
          onPress={() => commit(() => setEnabled((e) => !e))}
          style={styles.control}
        >
          <View style={[styles.track, enabled && styles.trackOn]}>
            <View style={[styles.thumb, enabled && styles.thumbOn]} />
          </View>
          <Text style={styles.controlLabel}>Wi-Fi</Text>
        </A11y.Pressable>
      </View>

      {/* activate — explicit string announced on double-tap */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>activate · cycling value</Text>
        <Text style={styles.sectionSub}>
          optimistic={'{{'} activate: “{PRIORITIES[nextPriority]}” {'}}'} —
          announced on double-tap
        </Text>
        <A11y.Pressable
          tintType="none"
          accessibilityRole="button"
          accessibilityLabel="Priority"
          accessibilityValue={{ text: PRIORITIES[priority] }}
          optimistic={opt({ activate: PRIORITIES[nextPriority] })}
          onPress={() => commit(() => setPriority(nextPriority))}
          style={styles.control}
        >
          <Text style={styles.controlLabel}>Priority</Text>
          <View style={styles.valuePill}>
            <Text style={styles.valuePillText}>{PRIORITIES[priority]}</Text>
          </View>
        </A11y.Pressable>
      </View>

      {/* increase / decrease — adjustable */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          increase / decrease · adjustable
        </Text>
        <Text style={styles.sectionSub}>
          optimistic={'{{'} increase: “{quantity + 1}”, decrease: “
          {Math.max(0, quantity - 1)}” {'}}'} — swipe up / down
        </Text>
        <A11y.Pressable
          tintType="none"
          accessibilityRole="adjustable"
          accessibilityLabel="Quantity"
          accessibilityValue={{ text: String(quantity) }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={adjust(setQuantity)}
          optimistic={opt({
            increase: String(quantity + 1),
            decrease: String(Math.max(0, quantity - 1)),
          })}
          style={styles.control}
        >
          <Text style={styles.controlLabel}>Quantity</Text>
          <Text style={styles.quantity}>{quantity}</Text>
        </A11y.Pressable>
      </View>

      {/* Live state panel */}
      <View style={styles.monitor}>
        <Text style={styles.monitorTitle}>Live state</Text>
        <Row label="Checkbox" value={checked ? 'checked' : 'unchecked'} />
        <View style={styles.divider} />
        <Row label="Switch" value={enabled ? 'on' : 'off'} />
        <View style={styles.divider} />
        <Row label="Priority" value={PRIORITIES[priority] as string} />
        <View style={styles.divider} />
        <Row label="Quantity" value={String(quantity)} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  notice: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  noticeText: { fontSize: 13, color: '#92400e' },

  toggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  toggleSub: { fontSize: 12, color: '#94a3b8' },

  section: { gap: 8 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: 'monospace',
  },
  sectionSub: { fontSize: 12, color: '#64748b' },

  control: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  controlLabel: { fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  checkboxMark: { color: '#ffffff', fontSize: 16, fontWeight: '800' },

  track: {
    width: 46,
    height: 28,
    borderRadius: 99,
    backgroundColor: '#cbd5e1',
    padding: 3,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: '#16a34a' },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 99,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  thumbOn: { alignSelf: 'flex-end' },

  valuePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: '#ede9fe',
  },
  valuePillText: { fontSize: 14, fontWeight: '700', color: '#6d28d9' },

  quantity: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    minWidth: 36,
    textAlign: 'right',
  },

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
  rowLabel: { fontSize: 13, fontWeight: '600', color: '#94a3b8', width: 80 },
  rowValue: { fontSize: 13, color: '#e2e8f0', flex: 1 },
  divider: { height: 1, backgroundColor: '#1e293b' },
});
