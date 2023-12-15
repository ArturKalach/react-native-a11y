import { useNavigation } from "@react-navigation/native";
import React, {useState} from "react";
import { Text, TextInput, StyleSheet } from "react-native";
import { DrawerNavigation, REF_MANAGEMENT } from "../../../navigation";
import { KeyboardExample, NavBar, Screen } from "../../../components";

export const AndroidTextInputFocus = () => {
  const navigation = useNavigation<DrawerNavigation>();
  const goBack = () => navigation.navigate(REF_MANAGEMENT);
  const [inputValue0, setInputValue0] = useState('First');
  const [inputValue1, setInputValue1] = useState('Second');
  const [inputValue2, setInputValue2] = useState('Third');

  return (
    <Screen>
      <KeyboardExample>
        <Text style={styles.title}>Android text input focus</Text>
        <Text style={styles.line}>
          Android has a problem with input focus, there are a solution with overriding native implementation
        </Text>
        <Text style={styles.line}>
          Use keyboard to navigate (tab/shift+tab)
        </Text>
        <TextInput style={styles.textInput} value={inputValue0} onChangeText={setInputValue0}/>
        <TextInput style={styles.textInput} value={inputValue1} onChangeText={setInputValue1}/>
        <TextInput style={styles.textInput} value={inputValue2} onChangeText={setInputValue2}/>
        <NavBar back={goBack} />
      </KeyboardExample>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 25, fontWeight: "bold", marginBottom: 10 },
  line: { fontSize: 20, marginBottom: 5 },
  lastLine: { fontSize: 20, marginBottom: 10 },
  textInput: { borderColor: 'black', borderWidth: 1, width: '100%'}
});
