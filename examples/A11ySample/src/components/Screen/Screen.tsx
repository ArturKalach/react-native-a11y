import React from 'react';
import { useDrawerStatus } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { KeyboardProvider } from 'react-native-a11y';

export const Screen: React.FC = ({ children }) => {
  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <KeyboardProvider value={!isDrawerOpen}>
      <View style={styles.container}>{children}</View>
    </KeyboardProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});
