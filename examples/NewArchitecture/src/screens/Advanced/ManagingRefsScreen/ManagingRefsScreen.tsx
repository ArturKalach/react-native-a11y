import React, { useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text } from "react-native";
import {
  A11yModule,
  A11yOrder,
  useCombinedRef,
  useDynamicFocusOrder,
} from "react-native-a11y";

import { DrawerNavigation, DYNAMIC_ORDER } from "../../../navigation";
import { NavBar, ReaderExample, Screen } from "../../../components";

export const ManagingRefsScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goBack = () => navigation.navigate(DYNAMIC_ORDER);

  const { a11yOrder, registerOrder, setOrder } = useDynamicFocusOrder();
  const [firstRef, firstRefCallback] = useCombinedRef<Text>(registerOrder(0));
  const onLayoutHandler = useCallback(
    () => A11yModule.setA11yFocus(firstRef),
    [firstRef],
  );

  useFocusEffect(setOrder);
  useFocusEffect(onLayoutHandler);

  return (
    <Screen>
      <ReaderExample>
        <A11yOrder onLayout={onLayoutHandler} a11yOrder={a11yOrder}>
          <Text style={styles.font} ref={firstRefCallback}>
            First
          </Text>
          <Text style={styles.font} ref={registerOrder(2)}>
            Third
          </Text>
          <Text style={styles.font} ref={registerOrder(1)}>
            Second
          </Text>
        </A11yOrder>
      </ReaderExample>
      <NavBar back={goBack} />
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
  focusBtn: { marginTop: 10 },
  note: { marginTop: 5, marginBottom: 10 },
});
