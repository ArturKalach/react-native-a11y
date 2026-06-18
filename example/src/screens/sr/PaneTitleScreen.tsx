import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { A11y, type A11yPaneType } from 'react-native-a11y';
import { Screen } from '../../components';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <A11y.Input
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        onChangeText={onChangeText}
        accessibilityLabel={label}
      />
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TYPES: { value: A11yPaneType; label: string }[] = [
  { value: 'pane', label: 'pane' },
  { value: 'activity', label: 'activity' },
  { value: 'announce', label: 'announce' },
];

/**
 * Pane / screen-change announcements via A11y.PaneTitle and A11y.ScreenChange.
 *
 * The form configures the title, detach message and announcement `type`; opening
 * the modal mounts an A11y.PaneTitle so the screen reader posts the matching
 * notification (layout-changed / screen-change / plain announce) on appear, and
 * the detach message on dismiss.
 */
export const PaneTitleScreen = () => {
  const [title, setTitle] = useState('Details pane');
  const [detachMessage, setDetachMessage] = useState('Pane closed');
  const [type, setType] = useState<A11yPaneType>('pane');
  const [modalShown, setModalShown] = useState(false);
  const [screenChangeShown, setScreenChangeShown] = useState(false);

  return (
    <Screen
      title="Pane title / screen change"
      description="Mounting a pane posts a layout-changed announcement; A11y.ScreenChange posts a screen-change notification."
    >
      <View style={styles.container}>
        {/* Configure the pane */}
        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>A11y.PaneTitle</Text>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>title</Text> is announced when the pane
              mounts; <Text style={styles.bold}>detach message</Text> when it
              unmounts.
            </Text>
            <Field
              label="Title"
              value={title}
              placeholder="Details pane"
              onChangeText={setTitle}
            />
            <Field
              label="Detach message"
              value={detachMessage}
              placeholder="Pane closed"
              onChangeText={setDetachMessage}
            />
          </View>
        </View>

        {/* Announcement type */}
        <View style={styles.card}>
          <View style={[styles.cardAccent, styles.cardAccentPurple]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Type</Text>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>pane</Text> — layout-changed.{'\n'}
              <Text style={styles.bold}>activity</Text> — screen-change.{'\n'}
              <Text style={styles.bold}>announce</Text> — plain, no focus shift.
            </Text>
            <View style={styles.chipRow}>
              {TYPES.map((t) => (
                <Chip
                  key={t.value}
                  label={t.label}
                  active={type === t.value}
                  onPress={() => setType(t.value)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Open pane in a modal */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Open pane modal</Text>
            <Text style={styles.actionDesc}>
              Mounts an A11y.PaneTitle inside a modal — the configured title is
              announced on open, the detach message on close.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setModalShown(true)}
            accessibilityRole="button"
            accessibilityLabel="Open pane modal"
          >
            <Text style={styles.btnText}>Open pane modal</Text>
          </TouchableOpacity>
        </View>

        {/* ScreenChange */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>A11y.ScreenChange</Text>
            <Text style={styles.actionDesc}>
              PaneTitle pre-set to type="activity". Mount it to post a
              screen-change notification.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.btnPurple]}
            onPress={() => setScreenChangeShown((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={
              screenChangeShown
                ? 'Unmount screen change'
                : 'Mount screen change'
            }
          >
            <Text style={styles.btnText}>
              {screenChangeShown ? 'Unmount' : 'Mount'}
            </Text>
          </TouchableOpacity>
          {screenChangeShown ? (
            <A11y.ScreenChange title={title || 'Demo screen'}>
              <View style={styles.paneBox}>
                <Text style={styles.paneBoxText} accessible>
                  Announced as a screen change on mount.
                </Text>
              </View>
            </A11y.ScreenChange>
          ) : null}
        </View>

        <Modal
          visible={modalShown}
          animationType="slide"
          onRequestClose={() => setModalShown(false)}
        >
          <View style={styles.modal}>
            <A11y.PaneTitle
              title={title || 'Details pane'}
              detachMessage={detachMessage || 'Pane closed'}
              type={type}
            >
              <View style={styles.paneCard}>
                <Text style={styles.paneTag}>PANE</Text>
                <Text style={styles.modalTitle}>{title || 'Details pane'}</Text>
                <Text style={styles.modalDesc}>
                  This pane mounted with type="{type}". The screen reader was
                  notified when it appeared.
                </Text>
              </View>
            </A11y.PaneTitle>

            <TouchableOpacity
              style={[styles.btn, styles.btnFull]}
              onPress={() => setModalShown(false)}
              accessibilityRole="button"
              accessibilityLabel="Close pane modal"
            >
              <Text style={styles.btnText}>Close pane</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </Screen>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  cardAccent: { width: 5, backgroundColor: '#65a30d' },
  cardAccentPurple: { backgroundColor: '#7c3aed' },
  cardBody: { flex: 1, padding: 14, gap: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },

  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  input: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  chipActive: { borderColor: '#65a30d', backgroundColor: '#f0fdf4' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  chipTextActive: { color: '#16a34a' },

  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionInfo: { gap: 4 },
  actionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  actionDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },

  btn: {
    backgroundColor: '#65a30d',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  btnPurple: { backgroundColor: '#7c3aed' },
  btnFull: { alignSelf: 'stretch' },

  paneBox: {
    marginTop: 4,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  paneBoxText: { fontSize: 13, color: '#166534' },

  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
    backgroundColor: '#f8fafc',
  },
  paneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paneTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#65a30d',
    letterSpacing: 1,
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  modalDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});
