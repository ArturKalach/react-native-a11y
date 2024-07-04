import React from "react";
import { TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native";

import TextInputWrapperNative from "../../nativeSpecs/A11yTextInputWrapperNativeComponent";
import type { OnFocusChangeFn } from "./KeyboardFocusTextInput.types";

const focusMap = {
  default: 0,
  press: 1,
  auto: 2,
};

const blurMap = {
  default: 0,
  disable: 1,
  auto: 2,
};

export type KeyboardFocusTextInputProps = TextInputProps & {
  focusType?: keyof typeof focusMap;
  blurType?: keyof typeof blurMap;
  containerStyle?: StyleProp<ViewStyle>;
  onFocusChange?: OnFocusChangeFn;
};

export const KeyboardFocusTextInput = React.forwardRef<
  TextInput,
  KeyboardFocusTextInputProps
>(
  (
    {
      focusType = "default",
      blurType = "default",
      containerStyle,
      onFocusChange,
      ...props
    },
    ref,
  ) => (
    <TextInputWrapperNative
      onFocusChange={onFocusChange}
      focusType={focusMap[focusType]}
      blurType={blurMap[blurType]}
      style={containerStyle}
      ref={ref}
    >
      <TextInput blurOnSubmit={false} {...props} />
    </TextInputWrapperNative>
  ),
);
