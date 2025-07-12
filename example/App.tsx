/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useRef } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { A11yModule } from 'react-native-a11y';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const ref = useRef(null);
  const onPress = () => {
    A11yModule.setKeyboardFocus(ref);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <Button title="Start" onPress={onPress} />
        </View>
        <View>
          <Button title="Middle" onPress={onPress} />
        </View>
        <View>
          <Button ref={ref} title="End" onPress={() => console.log('b')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
