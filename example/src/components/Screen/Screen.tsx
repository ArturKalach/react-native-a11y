import React, { type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDrawerStatus } from '@react-navigation/drawer';
import { KeyboardProvider } from 'react-native-a11y';

export const Screen: React.FC<PropsWithChildren> = ({ children }) => {
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
