import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { A11y } from 'react-native-a11y';
import { Screen } from '../../components';

const Section = ({
  type,
  description,
  children,
}: {
  type: string;
  description: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionType}>a11yUIContainer="{type}"</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
    </View>
    {children}
  </View>
);

const ListExample = () => (
  <A11y.View
    style={styles.box}
    a11yUIContainer="list"
    accessibilityLabel="Menu. 4 items."
  >
    {['Espresso', 'Cappuccino', 'Latte', 'Americano'].map((label) => (
      <View
        key={label}
        accessible
        accessibilityLabel={label}
        style={styles.row}
      >
        <Text style={styles.rowText}>{label}</Text>
      </View>
    ))}
  </A11y.View>
);

const TableExample = () => (
  <A11y.View
    a11yUIContainer="table"
    accessibilityLabel="Schedule. 3 rows."
    style={styles.box}
  >
    <View style={[styles.tableRow, styles.tableRowHeader]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Day</Text>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Hours</Text>
    </View>
    {[
      ['Mon', '8'],
      ['Tue', '6'],
      ['Wed', '7'],
    ].map(([day, hours]) => (
      <View
        key={day}
        accessible
        accessibilityLabel={`${day}, ${hours} hours`}
        style={styles.tableRow}
      >
        <Text style={styles.tableCell}>{day}</Text>
        <Text style={styles.tableCell}>{hours}</Text>
      </View>
    ))}
  </A11y.View>
);

const LandmarkExample = () => (
  <A11y.View
    a11yUIContainer="landmark"
    importantForAccessibility="no"
    style={styles.box}
    accessibilityLabel="Promotions. Free delivery on orders over $20 this week."
  >
    <View accessible accessibilityRole="header" accessibilityLabel="Promotions">
      <Text style={styles.landmarkTitle}>Promotions</Text>
    </View>
    <Text style={styles.landmarkBody}>
      Free delivery on orders over $20 this week.
    </Text>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="See all deals"
      style={styles.landmarkBtn}
    >
      <Text style={styles.landmarkBtnText}>See all deals →</Text>
    </Pressable>
  </A11y.View>
);

const GroupExample = () => (
  <A11y.View
    a11yUIContainer="group"
    style={styles.box}
    accessibilityLabel="Order summary. Subtotal $18.50. Tax $1.85. Total $20.35."
    importantForAccessibility="no"
  >
    <View
      accessibilityLabel="Order summary. Subtotal $18.50. Tax $1.85. Total $20.35."
      style={styles.summary}
    >
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>$18.50</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax</Text>
        <Text style={styles.summaryValue}>$1.85</Text>
      </View>
      <View style={[styles.summaryRow, styles.summaryRowTotal]}>
        <Text style={styles.summaryTotalLabel}>Total</Text>
        <Text style={styles.summaryTotalValue}>$20.35</Text>
      </View>
    </View>
  </A11y.View>
);

/** A11y.View a11yUIContainer — iOS UIAccessibilityContainerType semantics. */
export const UIContainerScreen = () => (
  <Screen
    title="A11y UI Container"
    description="iOS only. Sets UIAccessibilityContainerType on the wrapping view so VoiceOver announces the right semantic grouping. Turn VoiceOver on and focus each section to hear the difference."
  >
    <Section
      type="list"
      description="VoiceOver announces 'list, N items' on entry and a position like '2 of 4' on each row."
    >
      <ListExample />
    </Section>

    <Section
      type="table"
      description="VoiceOver treats the area as tabular data and reads row context."
    >
      <TableExample />
    </Section>

    <Section
      type="landmark"
      description="Marks a major page region. VoiceOver users can jump between landmarks via the rotor."
    >
      <LandmarkExample />
    </Section>

    <Section
      type="group"
      description="Plain semantic grouping for related items that don't fit list, table, or landmark."
    >
      <GroupExample />
    </Section>
  </Screen>
);

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionHeader: { marginBottom: 8 },
  sectionType: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7c3aed',
    fontFamily: 'Menlo',
    marginBottom: 4,
  },
  sectionDescription: { fontSize: 12, color: '#64748b', lineHeight: 17 },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  rowText: { fontSize: 15, color: '#0f172a' },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
  },
  tableRowHeader: { backgroundColor: '#f8fafc' },
  tableCell: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  tableCellHeader: { fontWeight: '700', color: '#475569' },
  landmarkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  landmarkBody: {
    fontSize: 13,
    color: '#475569',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  landmarkBtn: {
    margin: 12,
    backgroundColor: '#7c3aed',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  landmarkBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  summary: { padding: 14, gap: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryRowTotal: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 4,
  },
  summaryLabel: { fontSize: 13, color: '#64748b' },
  summaryValue: { fontSize: 13, color: '#0f172a', fontWeight: '600' },
  summaryTotalLabel: { fontSize: 14, color: '#0f172a', fontWeight: '700' },
  summaryTotalValue: { fontSize: 14, color: '#0f172a', fontWeight: '800' },
});
