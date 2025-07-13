import React, { type PropsWithChildren } from 'react';
import { useA11yStatus } from 'react-native-a11y';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { B } from '../B';

const readerName = Platform.select({
  ios: 'VoiceOver',
  android: 'TalkBack',
  default: '',
});

export const ReaderExample: React.FC<PropsWithChildren> = ({ children }) => {
  const isA11yEnabled = useA11yStatus();

  return isA11yEnabled ? (
    <>{children}</>
  ) : (
    <View style={styles.container}>
      <Text style={styles.line}>
        Hello, this example include work with <B>{readerName}</B>.
      </Text>
      <Text style={styles.line}>
        Unfortunately, <B>{readerName}</B> is <B>disabled</B>, you can{' '}
        <B>enable {readerName}</B> in your <B>device settings</B>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { justifyContent: 'center', padding: 15 },
  line: { fontSize: 20, marginBottom: 5 },
});
