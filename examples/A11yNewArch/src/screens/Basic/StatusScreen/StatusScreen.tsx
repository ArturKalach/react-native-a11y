import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useA11yStatus, useKeyboardStatus } from "react-native-a11y";
import { NavBar } from "../../../components";
import {
  DYNAMIC_ORDER,
  DrawerNavigation,
  KEYBOARD_FOCUS,
} from "../../../navigation";

export const StatusScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goBack = () => navigation.navigate(KEYBOARD_FOCUS);
  const goNext = () => navigation.navigate(DYNAMIC_ORDER);

  const isKeyboardConnected = useKeyboardStatus();
  const isA11yEnabled = useA11yStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.font}>
        A11y Reader: {isA11yEnabled ? "on" : "off"}
      </Text>
      <Text style={styles.font}>
        Keyboard: {isKeyboardConnected ? "connected" : "disconnected"}
      </Text>
      <NavBar back={goBack} next={goNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  font: { fontSize: 25, marginBottom: 10 },
});
