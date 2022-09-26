import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
import { Button, StyleSheet, View } from "react-native";
import { A11yModule } from "react-native-a11y";
import {
  A11Y_ORDER,
  DrawerNavigation,
  KEYBOARD_FOCUS,
} from "../../../navigation";
import { NavBar, ReaderExample, Screen } from "../../components";

export const ReaderFocusScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goNext = () => navigation.navigate(KEYBOARD_FOCUS);
  const goBack = () => navigation.navigate(A11Y_ORDER);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  return (
    <Screen>
      <ReaderExample>
        <View style={styles.example}>
          <Button
            ref={ref1}
            onPress={() => A11yModule.setA11yFocus(ref3)}
            title="1. Set focus to third"
          />
          <Button
            ref={ref2}
            onPress={() => A11yModule.setA11yFocus(ref4)}
            title="2. Set focus to fourth"
          />
          <Button
            ref={ref3}
            onPress={() => A11yModule.setA11yFocus(ref2)}
            title="3. Set focus to second"
          />
          <Button
            ref={ref4}
            onPress={() => A11yModule.setA11yFocus(ref1)}
            title="4. Set focus to first"
          />
        </View>
      </ReaderExample>
      <NavBar next={goNext} back={goBack} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  example: { alignSelf: "stretch", marginBottom: 20 },
});
