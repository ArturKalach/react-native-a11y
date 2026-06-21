import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GROUP_META,
  GROUPS,
  SCREENS,
  type ScreenEntry,
} from '../navigation/screens';

type HomeScreenProps = {
  onSelect: (entry: ScreenEntry) => void;
};

/** Feature-grouped landing list. */
export const HomeScreen = ({ onSelect }: HomeScreenProps) => (
  <ScrollView
    style={styles.root}
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
  >
    <View style={styles.header}>
      <Text style={styles.title} accessibilityRole="header">
        react-native-a11y
      </Text>
      <Text style={styles.subtitle}>
        Accessibility primitives for screen readers and physical keyboards.
      </Text>
    </View>

    {GROUPS.map((group) => {
      const meta = GROUP_META[group];
      const entries = SCREENS.filter((s) => s.group === group);

      return (
        <View key={group} style={styles.group}>
          <View style={styles.groupHeader}>
            <View style={[styles.groupDot, { backgroundColor: meta.color }]} />
            <Text style={styles.groupTitle}>{group}</Text>
            <Text style={styles.groupCount}>{entries.length}</Text>
          </View>
          <Text style={styles.groupCaption}>{meta.caption}</Text>

          <View style={styles.cardList}>
            {entries.map((entry) => (
              <TouchableOpacity
                key={entry.key}
                style={styles.row}
                onPress={() => onSelect(entry)}
                accessibilityRole="button"
                accessibilityLabel={entry.title}
                accessibilityHint={entry.subtitle}
              >
                <View style={[styles.rail, { backgroundColor: meta.color }]} />
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{entry.title}</Text>
                  {entry.subtitle ? (
                    <Text style={styles.rowSubtitle}>{entry.subtitle}</Text>
                  ) : null}
                </View>
                <Text style={[styles.chevron, { color: meta.color }]}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 48, gap: 24 },

  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },

  group: { gap: 4 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupDot: { width: 9, height: 9, borderRadius: 99 },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  groupCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    backgroundColor: '#e2e8f0',
    minWidth: 18,
    textAlign: 'center',
    borderRadius: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
    overflow: 'hidden',
  },
  groupCaption: { fontSize: 12, color: '#94a3b8', marginLeft: 17 },

  cardList: { gap: 10, marginTop: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    paddingRight: 14,
  },
  rail: { alignSelf: 'stretch', width: 4 },
  rowBody: { flex: 1, paddingVertical: 14, paddingLeft: 14, gap: 2 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  rowSubtitle: { fontSize: 13, color: '#94a3b8' },
  chevron: { fontSize: 24, fontWeight: '700', marginLeft: 8 },
});
