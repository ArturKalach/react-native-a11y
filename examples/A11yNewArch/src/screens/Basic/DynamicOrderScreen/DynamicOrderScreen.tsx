import React, { useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text } from "react-native";
import { A11yOrder, useDynamicFocusOrder } from "react-native-a11y";

import {
  STATUS_SCREEN,
  DrawerNavigation,
  REF_MANAGEMENT,
} from "../../../navigation";
import { Button, NavBar, ReaderExample, Screen } from "../../../components";

export const DynamicOrderScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goBack = () => navigation.navigate(STATUS_SCREEN);
  const goNext = () => navigation.navigate(REF_MANAGEMENT);
  const [showThird, setState] = useState(true);

  const { a11yOrder, registerOrder, setOrder } = useDynamicFocusOrder();
  useFocusEffect(setOrder);

  const onPressHandler = () => setState(v => !v);

  return (
    <Screen>
      <ReaderExample>
        <A11yOrder a11yOrder={a11yOrder}>
          <Text style={styles.font} ref={registerOrder(0)}>
            First
          </Text>
          {showThird && (
            <Text style={styles.font} ref={registerOrder(2)}>
              Third
            </Text>
          )}
          <Text style={styles.font} ref={registerOrder(1)}>
            Second
          </Text>
          {!showThird && (
            <Text style={[styles.font]} ref={registerOrder(5)}>
              Fifth
            </Text>
          )}
          <Text style={styles.font} ref={registerOrder(4)}>
            Fourth
          </Text>
        </A11yOrder>
        <Button style={styles.update} onPress={onPressHandler} title="Update" />
      </ReaderExample>
      <NavBar back={goBack} next={goNext} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  font: { fontSize: 25 },
  update: { marginTop: 10 },
});
