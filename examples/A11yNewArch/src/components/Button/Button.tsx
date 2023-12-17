import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Pressable, FocusStyle, OnFocusChangeFn } from "react-native-a11y";

type Props = {
  title?: string;
  onPress?: () => void;
  style?: ViewStyle;
  canBeFocused?: boolean;
  focusStyle?: FocusStyle;
  accessible?: boolean;
};

export const Button = React.forwardRef<View, Props>(
  ({ title, onPress, style, focusStyle, canBeFocused = true, accessible = true }, ref) => {
    const fStyle = ({ focused }: { focused: boolean }) =>
      focused && styles.focus;

    const [focused, setFocusStatus] = useState(false);

    const onFocusChangeHandler: OnFocusChangeFn = event => {
      setFocusStatus(event.nativeEvent.isFocused);
    };

    return (
      <View style={style}>
        <Pressable
          onFocusChange={onFocusChangeHandler}
          canBeFocused={canBeFocused}
          onPress={onPress}
          style={styles.container}
          focusStyle={focusStyle || fStyle}
          ref={ref}
          accessible={accessible}
        >
          <Text
            accessible={false}
            style={[styles.font, focused && styles.focusedFont]}
          >
            {title}
          </Text>
        </Pressable>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderColor: "#111",
    borderRadius: 50,
    minWidth: 100,
  },
  font: { fontSize: 18, textAlign:'center', fontWeight: "bold", color: "#111" },
  focus: {
    backgroundColor: "#aaa",
    borderColor: "#eee",
  },
  focusedFont: {
    color: "#fff",
  },
});
