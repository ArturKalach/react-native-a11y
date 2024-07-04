import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, StyleSheet, Switch, Platform } from "react-native";
import { KeyboardFocusTextInput } from "react-native-a11y";
import {
  DrawerNavigation,
  KEYBOARD_FOCUS,
  KEYBOARD_ON_PRESS,
} from "../../../navigation";
import { KeyboardExample, NavBar, Screen } from "../../../components";
import { View } from "react-native";

export const TextInputFocus = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goBack = () => navigation.navigate(KEYBOARD_FOCUS);
  const goNext = () => navigation.navigate(KEYBOARD_ON_PRESS);
  const [inputValue0, setInputValue0] = useState("First");
  const [inputValue1, setInputValue1] = useState("Second");
  const [inputValue2, setInputValue2] = useState("Third");
  const [isAutoFocus, setIsAutoFocus] = useState(Platform.OS === "android");
  const [isAutoBlur, setIsAutoBlur] = useState(Platform.OS === "android");

  return (
    <Screen>
      <KeyboardExample>
        <Text style={styles.title}>Text input focus</Text>
        <Text style={styles.line}>
          There could be some problems with focusing text input by keyboard, the
          KeyboardFocusTextInput is a component which help to define and
          configure focus behavior of TextInput on Android and iOS.
        </Text>

        <Text style={styles.line}>
          Use keyboard to navigate (tab/shift+tab)
        </Text>
        <View style={{ flexDirection: "row", padding: 10 }}>
          <View style={{ flex: 1 }}>
            <Text>Auto focus</Text>
            <Switch value={isAutoFocus} onValueChange={setIsAutoFocus} />
          </View>
          <View style={{ flex: 1 }}>
            <Text>Auto blur</Text>
            <Switch value={isAutoBlur} onValueChange={setIsAutoBlur} />
          </View>
        </View>

        <KeyboardFocusTextInput
          style={styles.textInput}
          value={inputValue0}
          containerStyle={styles.textInputContainer}
          onChangeText={setInputValue0}
          focusType={isAutoFocus ? "auto" : "press"}
          blurType={isAutoBlur ? "auto" : "default"}
        />
        <KeyboardFocusTextInput
          style={styles.textInput}
          value={inputValue1}
          containerStyle={styles.textInputContainer}
          onChangeText={setInputValue1}
          focusType={isAutoFocus ? "auto" : "press"}
          blurType={isAutoBlur ? "auto" : "default"}
        />
        <KeyboardFocusTextInput
          style={styles.textInput}
          containerStyle={styles.textInputContainer}
          value={inputValue2}
          onChangeText={setInputValue2}
          focusType={isAutoFocus ? "auto" : "press"}
          blurType={isAutoBlur ? "auto" : "default"}
        />
      </KeyboardExample>
      <NavBar back={goBack} next={goNext} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  line: { fontSize: 20, marginBottom: 5 },
  lastLine: { fontSize: 20, marginBottom: 10 },
  textInputContainer: { width: "95%" },
  textInput: {
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 5,
  },
});
