import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useKeyboardStatus } from 'react-native-a11y';
import { B } from '../B';

export const KeyboardExample: React.FC = ({ children }) => {
  const isKeyboardConnected = useKeyboardStatus();

  return isKeyboardConnected ? (
    <>{children}</>
  ) : (
    <View style={styles.container}>
      <Text style={styles.line}>
        Hello, this example include work with <B>Keyboard</B>.
      </Text>
      <Text style={styles.line}>
        Unfortunately, <B>Keyboard is not connected</B>, please connect keyboard
        to continue
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  line: { fontSize: 20, marginBottom: 5 },
});
