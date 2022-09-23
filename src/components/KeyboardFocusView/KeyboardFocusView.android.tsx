import React from "react";
import { View } from "react-native";
import { useFocusStyle } from "../../hooks";
import { NativeFocusWrapper } from "./RCA11yFocusWrapper";
import { useCanBeFocused } from "../../providers";
import type { KeyboardFocusViewProps } from "./KeyboardFocusView.types";

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused,
      onFocusChange,
      focusStyle,
      children,
      style,
      withView = true,
      ...props
    },
    ref,
  ) => {
    const canBecomeFocused = useCanBeFocused();
    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange,
    );

    return (
      <NativeFocusWrapper
        onFocusChange={onFocusChangeHandler}
        style={[style, fStyle]}
        canBeFocused={canBecomeFocused && canBeFocused}
        ref={ref}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {withView ? <View accessible>{children}</View> : children}
      </NativeFocusWrapper>
    );
  },
);
