import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  announce,
  cancel,
  cancelAll,
  ScreenReader,
  type AnnouncementResult,
  type AnnounceOptions,
  type AnnouncePriority,
} from 'react-native-a11y';
import { Screen } from '../../components';
import type { ScreenNavProps } from '../../navigation/screens';

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

const STATUS_COLOR: Record<string, string> = {
  spoken: '#16a34a',
  fired: '#2563eb',
  cancelled: '#dc2626',
};

function ResultBadge({
  result,
  onCancel,
}: {
  result: AnnouncementResult | null;
  onCancel: () => void;
}) {
  if (!result) return null;

  const color = STATUS_COLOR[result.status] ?? '#64748b';
  const canCancel = result.status !== 'cancelled' && result.id.length > 0;

  return (
    <View style={[styles.resultBadge, { borderColor: color }]}>
      <View style={styles.resultLeft}>
        <Text style={[styles.resultLabel, { color }]}>{result.status}</Text>
        <Text style={styles.resultId} numberOfLines={1}>
          {result.id ? `id: ${result.id.slice(0, 8)}…` : 'no id'}
        </Text>
      </View>
      {canCancel && (
        <TouchableOpacity
          onPress={onCancel}
          style={styles.cancelBtn}
          accessibilityRole="button"
          accessibilityLabel="Cancel last announcement"
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const PRIORITIES: AnnouncePriority[] = ['low', 'default', 'high'];
const DELAYS = [0, 250, 1000];

/**
 * Exercises the merged announce API — `ScreenReader.announce` (calm: nav-aware,
 * debounced, batched) and the direct `announce` (immediate, iOS speech attributes)
 * — across priority, queue, delay, bursts, modal, and navigation transitions.
 */
export const AnnounceScreen = ({ onNext }: ScreenNavProps) => {
  const [calm, setCalm] = useState(true);
  const [priority, setPriority] = useState<AnnouncePriority>('default');
  const [queue, setQueue] = useState(true);
  const [delayMs, setDelayMs] = useState(0);
  const [result, setResult] = useState<AnnouncementResult | null>(null);
  const [isModalShown, setIsModalShown] = useState(false);

  // Routes calm → ScreenReader.announce, direct → announce({ calm: false }).
  // Per-call extraOpts override the screen-level settings.
  const post = (message: string, extraOpts: AnnounceOptions = {}) => {
    const opts: AnnounceOptions = {
      priority,
      queue,
      ...(delayMs > 0 && { delayMs }),
      ...extraOpts,
    };
    const promise = calm
      ? ScreenReader.announce(message, opts)
      : announce(message, { calm: false, ...opts });
    return promise.then(setResult);
  };

  const cancelLast = () => {
    if (!result?.id) return;
    cancel(result.id).then(setResult);
  };

  const multiFire = () => {
    post('First message in the burst');
    post('Second message in the burst');
    post('Third message in the burst');
  };

  return (
    <Screen
      title="Announcements"
      description="Exercises every option exposed by ScreenReader.announce (calm) and the direct announce API."
    >
      <View style={styles.container}>
        {/* Mode */}
        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Mode</Text>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>calm</Text> — routes through{' '}
              <Text style={styles.bold}>ScreenReader.announce</Text>. Nav-aware,
              300 ms debounce, batches concurrent calls.{'\n'}
              <Text style={styles.bold}>direct</Text> — posts immediately via{' '}
              <Text style={styles.bold}>announce</Text> with speech attributes
              (iOS).
            </Text>
            <View style={styles.chipRow}>
              <Chip label="calm" active={calm} onPress={() => setCalm(true)} />
              <Chip
                label="direct"
                active={!calm}
                onPress={() => setCalm(false)}
              />
            </View>
          </View>
        </View>

        {/* Priority */}
        <View style={styles.card}>
          <View style={[styles.cardAccent, styles.cardAccentPurple]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Priority</Text>
            <Text style={styles.cardDesc}>
              iOS 17+: maps to{' '}
              <Text style={styles.bold}>UIAccessibilityPriority</Text>. Use{' '}
              <Text style={styles.bold}>queue: false</Text> to interrupt ongoing
              speech.
            </Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map((p) => (
                <Chip
                  key={p}
                  label={p}
                  active={priority === p}
                  onPress={() => setPriority(p)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Queue + Delay */}
        <View style={styles.card}>
          <View style={[styles.cardAccent, styles.cardAccentAmber]} />
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>Queue & delay</Text>
            <Text style={styles.cardDesc}>
              <Text style={styles.bold}>queue</Text> — wait for current speech
              before speaking.{'\n'}
              <Text style={styles.bold}>delayMs</Text> — direct mode only;
              ignored by the calm service.
            </Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>queue</Text>
              <View style={styles.chipRow}>
                <Chip
                  label="on"
                  active={queue}
                  onPress={() => setQueue(true)}
                />
                <Chip
                  label="off"
                  active={!queue}
                  onPress={() => setQueue(false)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>delay</Text>
              <View style={styles.chipRow}>
                {DELAYS.map((d) => (
                  <Chip
                    key={d}
                    label={d === 0 ? 'none' : `${d}ms`}
                    active={delayMs === d}
                    onPress={() => setDelayMs(d)}
                  />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Last result + cancel-by-id */}
        <ResultBadge result={result} onCancel={cancelLast} />

        {/* Quick announce */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Quick announce</Text>
            <Text style={styles.actionDesc}>
              Plain message with the current mode and options
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => post('Hello from the announce module')}
            accessibilityRole="button"
            accessibilityLabel="Post quick announcement"
          >
            <Text style={styles.btnText}>Announce</Text>
          </TouchableOpacity>
        </View>

        {/* Multi-fire */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Burst (3 in a row)</Text>
            <Text style={styles.actionDesc}>
              Fires three messages back-to-back — calm mode batches them into
              one 300 ms debounced post; direct mode supersedes (only the last
              resolves as spoken).
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.btnPurple]}
            onPress={multiFire}
            accessibilityRole="button"
            accessibilityLabel="Fire three announcements"
          >
            <Text style={styles.btnText}>Fire 3</Text>
          </TouchableOpacity>
        </View>

        {/* iOS speech attributes — direct mode only */}
        {Platform.OS === 'ios' && !calm && (
          <View style={styles.actionCard}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Speech options (iOS)</Text>
              <Text style={styles.actionDesc}>
                Every speech attribute available in direct mode — pitch, spell
                out, punctuation, language, and IPA notation.
              </Text>
            </View>
            <View style={styles.btnGrid}>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex]}
                onPress={() =>
                  post('Low pitch example', { speech: { pitch: 0.5 } })
                }
                accessibilityRole="button"
                accessibilityLabel="Announce with low pitch"
              >
                <Text style={styles.btnText}>Pitch 0.5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex]}
                onPress={() =>
                  post('High pitch example', { speech: { pitch: 1.7 } })
                }
                accessibilityRole="button"
                accessibilityLabel="Announce with high pitch"
              >
                <Text style={styles.btnText}>Pitch 1.7</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex, styles.btnPurple]}
                onPress={() => post('USA', { speech: { spellOut: true } })}
                accessibilityRole="button"
                accessibilityLabel="Spell out USA"
              >
                <Text style={styles.btnText}>Spell out</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex, styles.btnPurple]}
                onPress={() =>
                  post('Hello, world. How are you?', {
                    speech: { punctuation: true },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Read punctuation aloud"
              >
                <Text style={styles.btnText}>Punctuation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex, styles.btnAmber]}
                onPress={() =>
                  post('Hola, ¿cómo estás hoy?', {
                    speech: { language: 'es-ES' },
                  })
                }
                accessibilityRole="button"
                accessibilityLabel="Spanish language"
              >
                <Text style={styles.btnText}>Spanish (es-ES)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnFlex, styles.btnAmber]}
                onPress={() =>
                  post('tomato', { speech: { ipaNotation: 'təˈmɑːtəʊ' } })
                }
                accessibilityRole="button"
                accessibilityLabel="IPA pronunciation"
              >
                <Text style={styles.btnText}>IPA</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Cancel all */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Cancel all</Text>
            <Text style={styles.actionDesc}>
              Clears the calm queue and interrupts any in-progress direct
              announcement
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, styles.btnDanger]}
            onPress={() => cancelAll().then(setResult)}
            accessibilityRole="button"
            accessibilityLabel="Cancel all announcements"
          >
            <Text style={styles.btnText}>Cancel all</Text>
          </TouchableOpacity>
        </View>

        {/* Modal announce */}
        <View style={styles.actionCard}>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Modal announce</Text>
            <Text style={styles.actionDesc}>
              Opens a modal and announces the event — compare calm vs direct to
              see nav-lock behavior
            </Text>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              post('Modal has been opened');
              setIsModalShown(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Open modal with announcement"
          >
            <Text style={styles.btnText}>Open modal</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation announce */}
        {onNext && (
          <View style={styles.actionCard}>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Navigation announce</Text>
              <Text style={styles.actionDesc}>
                Navigates to the next screen while announcing the transition —
                calm mode handles nav-lock automatically
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline]}
              onPress={() => {
                post('Navigated to the next screen');
                onNext();
              }}
              accessibilityRole="button"
              accessibilityLabel="Navigate to next screen with announcement"
            >
              <Text style={styles.btnOutlineText}>Navigate</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={isModalShown} animationType="slide">
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Modal Content</Text>
            <Text style={styles.modalDesc}>
              The screen reader was announced when this modal opened.
            </Text>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setIsModalShown(false);
                post('Modal has been closed');
              }}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Text style={styles.btnText}>Close modal</Text>
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
  cardAccentAmber: { backgroundColor: '#d97706' },
  cardBody: { flex: 1, padding: 14, gap: 10 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },

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

  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 13, fontWeight: '600', color: '#64748b', width: 50 },

  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#f8fafc',
    gap: 8,
  },
  resultLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultLabel: { fontSize: 13, fontWeight: '700' },
  resultId: { fontSize: 12, color: '#94a3b8', flex: 1 },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#dc2626',
  },
  cancelBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },

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

  btnGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  btnFlex: { flexGrow: 1, flexBasis: '45%' },

  btn: {
    backgroundColor: '#65a30d',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  btnDanger: { backgroundColor: '#dc2626' },
  btnPurple: { backgroundColor: '#7c3aed' },
  btnAmber: { backgroundColor: '#d97706' },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#65a30d',
  },
  btnOutlineText: { color: '#65a30d', fontWeight: '700', fontSize: 15 },

  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    backgroundColor: '#f8fafc',
  },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#1e293b' },
  modalDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
});
