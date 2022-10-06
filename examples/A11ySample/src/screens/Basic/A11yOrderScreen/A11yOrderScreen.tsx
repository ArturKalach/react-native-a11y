import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text } from "react-native";
import { A11yOrder, useFocusOrder } from "react-native-a11y";

import { ABOUT, DrawerNavigation, READER_FOCUS } from "../../../../navigation";
import { NavBar, ReaderExample, Screen } from "../../../components";

export const A11yOrderScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goNext = () => navigation.navigate(READER_FOCUS);
  const goBack = () => navigation.navigate(ABOUT);

  const { a11yOrder, refs, setOrder } = useFocusOrder<Text>(3);
  useFocusEffect(setOrder);

  return (
    <Screen>
      <ReaderExample>
        <A11yOrder a11yOrder={a11yOrder}>
          <Text style={styles.font} ref={refs[0]}>
            First
          </Text>
          <Text style={styles.font} ref={refs[2]}>
            Third
          </Text>
          <Text style={styles.font} ref={refs[1]}>
            Second
          </Text>
        </A11yOrder>
      </ReaderExample>
      <NavBar next={goNext} back={goBack} />
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
});
