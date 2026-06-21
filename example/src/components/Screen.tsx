import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type ScreenProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

/** Simple scrollable screen wrapper with a title + optional description. */
export const Screen = ({ title, description, children }: ScreenProps) => (
  <ScrollView
    style={styles.root}
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.title} accessibilityRole="header">
      {title}
    </Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    <View style={styles.body}>{children}</View>
  </ScrollView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', color: '#111' },
  description: { fontSize: 14, color: '#555', marginTop: 6 },
  body: { marginTop: 16, gap: 12 },
});
