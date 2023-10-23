import React, {useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardFocusView } from "react-native-a11y";
import { KeyboardExample, NavBar, Screen } from "../../../components";
import {
  DrawerNavigation,
  KEYBOARD_FOCUS,
  STATUS_SCREEN,
} from "../../../navigation";

export const KeyboardOnPressScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goNext = () => navigation.navigate(STATUS_SCREEN);
  const goBack = () => navigation.navigate(KEYBOARD_FOCUS);
  const [isKeyDown, setIsKeyDown] = useState(true);
  const [keyInfo, setKeyInfo] = useState({});

  const onKeyUpHandler = (e) => {
    setIsKeyDown(false)
    setKeyInfo(e.nativeEvent)
  }
  const onKeyDownHandler = (e) => {
    setIsKeyDown(true)
    setKeyInfo(e.nativeEvent)
  }

  return (
    <Screen>
        <KeyboardExample>
            <KeyboardFocusView onKeyDownPress={onKeyDownHandler} onKeyUpPress={onKeyUpHandler}>
                <View>
                    <Text>{isKeyDown ? 'Press begin:' : 'Press ended:'}</Text>
                </View>
                {Object.keys(keyInfo).map(key => <View key={key}>{
                    <Text>{`${key}: ${keyInfo[key]}`}</Text>
                }</View>)}
            </KeyboardFocusView>
        </KeyboardExample>
      <NavBar next={goNext} back={goBack} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  btn: { marginBottom: 10, width: "100%" },
});
