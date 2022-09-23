import { useNavigation } from '@react-navigation/native';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { A11yModule, KeyboardProvider } from 'react-native-a11y';
import { KeyboardExample, NavBar, Screen } from '../../components';
import {
  DrawerNavigation,
  READER_FOCUS,
  STATUS_SCREEN,
} from '../../../navigation';
import { Button } from '../../components/Button/Button';

export const KeyboardFocusScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goNext = () => navigation.navigate(STATUS_SCREEN);
  const goBack = () => navigation.navigate(READER_FOCUS);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  return (
    <Screen>
      <KeyboardExample>
        <Button
          canBeFocused={false}
          style={styles.btn}
          title="0. Disabled focus"
        />
        <Button
          ref={ref1}
          style={styles.btn}
          onPress={() => A11yModule.setKeyboardFocus(ref3)}
          title="1. Set focus to third"
        />
        <Button
          ref={ref2}
          style={styles.btn}
          onPress={() => A11yModule.setKeyboardFocus(ref4)}
          title="2. Set focus to fourth"
        />
        <Button
          ref={ref3}
          style={styles.btn}
          onPress={() => A11yModule.setKeyboardFocus(ref2)}
          title="3. Set focus to second"
        />
        <Button
          ref={ref4}
          style={styles.btn}
          onPress={() => A11yModule.setKeyboardFocus(ref1)}
          title="4. Set focus to first"
        />
        <KeyboardProvider value={false}>
          <Button style={styles.btn} title="5. Disabled focus" />
          <Button style={styles.btn} title="6. Disabled focus" />
        </KeyboardProvider>
      </KeyboardExample>
      <NavBar next={goNext} back={goBack} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: { marginBottom: 10, width: '100%' },
});
