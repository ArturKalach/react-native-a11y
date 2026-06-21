import { StyleSheet, Text, View } from 'react-native';
import {
  useIsKeyboardConnected,
  useIsScreenReaderEnabled,
} from 'react-native-a11y';
import { Screen } from '../../components';

type StatusCardProps = {
  title: string;
  hook: string;
  active: boolean;
  on: string;
  off: string;
  hint: string;
  accent: string;
};

/** A single live-status card with an Enabled/Disabled style pill. */
const StatusCard = ({
  title,
  hook,
  active,
  on,
  off,
  hint,
  accent,
}: StatusCardProps) => (
  <View style={styles.card}>
    <View style={[styles.cardAccent, { backgroundColor: accent }]} />
    <View style={styles.cardBody}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View
          style={[
            styles.pill,
            { backgroundColor: active ? '#16a34a' : '#94a3b8' },
          ]}
          accessibilityLabel={`${title}: ${active ? on : off}`}
        >
          <View style={styles.pillDot} />
          <Text style={styles.pillText}>{active ? on : off}</Text>
        </View>
      </View>
      <Text style={styles.hook}>{hook}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  </View>
);

/**
 * Live status of the two runtime-detection hooks — `useIsScreenReaderEnabled`
 * and `useIsKeyboardConnected`. Toggle VoiceOver/TalkBack or connect/disconnect
 * a hardware keyboard and watch the pills flip in real time.
 */
export const StatusScreen = () => {
  const screenReaderEnabled = useIsScreenReaderEnabled();
  const keyboardConnected = useIsKeyboardConnected();

  return (
    <Screen
      title="Status"
      description="Live values of useIsScreenReaderEnabled and useIsKeyboardConnected. The pills update as the screen reader or a hardware keyboard is toggled."
    >
      <View style={styles.container}>
        <StatusCard
          title="Screen reader"
          hook="useIsScreenReaderEnabled()"
          active={screenReaderEnabled}
          on="Enabled"
          off="Disabled"
          hint="Toggle VoiceOver (iOS) or TalkBack (Android)."
          accent="#16a34a"
        />
        <StatusCard
          title="Physical keyboard"
          hook="useIsKeyboardConnected()"
          active={keyboardConnected}
          on="Connected"
          off="Disconnected"
          hint="Connect or disconnect a hardware keyboard."
          accent="#4f46e5"
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 16, gap: 6 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: '#ffffff',
  },
  pillText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },

  hook: { fontSize: 13, color: '#475569', fontFamily: 'monospace' },
  hint: { fontSize: 13, color: '#94a3b8' },
});
