import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type CardProps = PropsWithChildren<{ label?: string }>;

/** Bordered section used to group a demo within a screen. */
export const Card = ({ label, children }: CardProps) => (
  <View style={styles.card}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    backgroundColor: '#fafafa',
  },
  label: { fontSize: 13, fontWeight: '600', color: '#666' },
});
