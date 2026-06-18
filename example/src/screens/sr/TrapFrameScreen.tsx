import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { A11y, type FocusStyle } from 'react-native-a11y';

const FOCUS_STYLE: FocusStyle = {
  borderColor: '#22c55e',
  borderWidth: 2,
};

const VARIANT_BG: Record<string, string> = {
  default: '#eef2ff',
  primary: '#4f46e5',
  danger: '#dc2626',
};
const VARIANT_COLOR: Record<string, string> = {
  default: '#4f46e5',
  primary: '#ffffff',
  danger: '#ffffff',
};

/**
 * A11y.Pressable button — keyboard- and screen-reader-focusable, so the trap's
 * containment is observable with both a hardware keyboard (Tab) and VoiceOver/
 * TalkBack. The green ring is our own focusStyle; the iOS system halo is off.
 */
const Btn = ({
  title,
  onPress,
  variant = 'default',
}: {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger';
}) => (
  <A11y.Pressable
    style={[styles.btn, { backgroundColor: VARIANT_BG[variant] }]}
    onPress={onPress}
    focusStyle={FOCUS_STYLE}
    haloEffect={false}
    defaultFocusHighlightEnabled={false}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <Text style={[styles.btnText, { color: VARIANT_COLOR[variant] }]}>
      {title}
    </Text>
  </A11y.Pressable>
);

/** The trapped dialog — focus (SR + keyboard) is confined here until dismissed. */
const FocusTrapDialog = ({ onClose }: { onClose: () => void }) => (
  <View style={styles.overlay}>
    {/* forceLock moves focus inside on mount; lock releases on unmount. */}
    <A11y.FocusTrap forceLock style={styles.dialog}>
      <View style={styles.dialogHeader}>
        <Text style={styles.dialogTitle}>Focus trapped</Text>
        <Text style={styles.dialogSubtitle}>
          Keyboard and screen-reader focus is locked inside this dialog. The
          background content is unreachable until you dismiss it.
        </Text>
      </View>
      <View style={styles.dialogActions}>
        <Btn
          title="Confirm"
          variant="primary"
          onPress={() => console.log('confirmed')}
        />
        <Btn title="Cancel" variant="danger" onPress={onClose} />
      </View>
    </A11y.FocusTrap>
  </View>
);

/**
 * Focus containment demo, mirroring react-native-external-keyboard's FocusLock
 * example but on the merged primitives:
 *  • A11y.FocusFrame wraps the screen — detects focus escaping the subtree.
 *  • A11y.FocusTrap (in the overlay) confines BOTH screen-reader and keyboard
 *    focus to the dialog while it's open.
 */
export const TrapFrameScreen = () => {
  const [shown, setShown] = useState(false);

  return (
    <A11y.FocusFrame style={styles.flex}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Focus trap / frame
          </Text>
          <Text style={styles.description}>
            A11y.FocusTrap confines screen-reader + keyboard focus to its
            subtree; A11y.FocusFrame only detects focus leaving. Tab with a
            hardware keyboard or swipe with a screen reader to compare.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>BACKGROUND CONTENT</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Outside button A</Text>
            <Text style={styles.cardDesc}>
              Reachable only while the trap is closed
            </Text>
            <Btn title="Interact" onPress={() => console.log('A pressed')} />
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Outside button B</Text>
            <Text style={styles.cardDesc}>
              Also unreachable while the trap is active
            </Text>
            <Btn title="Interact" onPress={() => console.log('B pressed')} />
          </View>
        </View>

        <View style={styles.triggerSection}>
          <Btn
            title="Open focus trap"
            variant="primary"
            onPress={() => setShown(true)}
          />
        </View>
      </View>

      {shown && <FocusTrapDialog onClose={() => setShown(false)} />}
    </A11y.FocusFrame>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    gap: 16,
  },

  header: { gap: 6 },
  title: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  description: { fontSize: 13, color: '#64748b', lineHeight: 19 },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginLeft: 4,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  cardDesc: { fontSize: 13, color: '#8e8e93', marginBottom: 4 },

  triggerSection: { marginTop: 'auto' },

  btn: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  btnText: { fontSize: 15, fontWeight: '600' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    gap: 20,
  },
  dialogHeader: { gap: 8 },
  dialogTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  dialogSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  dialogActions: { gap: 10 },
});
