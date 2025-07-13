import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { Pressable } from 'react-native-a11y';
import { StyleSheet, View } from 'react-native';

export const DrawerToggle = ({
  navigation,
}: Pick<DrawerHeaderProps, 'navigation'>) => {
  return (
    <Pressable onPress={navigation.toggleDrawer} style={styles.container}>
      <View style={styles.line} />
      <View style={styles.line} />
      <View style={styles.lastLine} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { marginLeft: 10 },
  line: {
    width: 20,
    height: 3,
    backgroundColor: '#000',
    marginBottom: 3,
  },
  lastLine: {
    width: 20,
    height: 3,
    backgroundColor: '#000',
  },
});
