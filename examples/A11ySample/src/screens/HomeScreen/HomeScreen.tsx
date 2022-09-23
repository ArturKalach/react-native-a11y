import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet } from "react-native";
import { A11Y_ORDER, DrawerNavigation } from "../../../navigation";
import { NavBar, Screen } from "../../components";

export const HomeScreen = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goToFirstExample = () => navigation.navigate(A11Y_ORDER);

  return (
    <Screen>
      <Text style={styles.title}>React native A11Y</Text>
      <Text style={styles.line}>
        Hello travelers, this library is developed to improve a11y in RN.
      </Text>
      <Text style={styles.line}>
        Features of this library in some way are dirty hack and we hope that
        this functionality will be developed and fixed in RN in future.
      </Text>
      <Text style={styles.lastLine}>
        Right for now this library is a result of developing an app with a11y
        based on WCAG and can help create an accessible application and not
        only.
      </Text>
      <NavBar next={goToFirstExample} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  line: { fontSize: 20, marginBottom: 5 },
  lastLine: { fontSize: 20, marginBottom: 10 },
});
