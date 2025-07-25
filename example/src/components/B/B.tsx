import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

export const B: React.FC<PropsWithChildren> = ({ children }) => {
  return <Text style={styles.b}>{children}</Text>;
};

const styles = StyleSheet.create({
  b: { fontWeight: 'bold' },
});
