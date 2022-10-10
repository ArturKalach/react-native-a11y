import React, { useCallback } from "react";
import type { View } from "react-native";

import { useCanBeFocused } from "../../providers";
import { NativeFocusWrapper, OnFocusChangeFn } from "./RCA11yFocusWrapper";
import { A11yModule } from "../../modules";
import { useFocusStyle } from "../../hooks";
import type { KeyboardFocusViewProps } from "./KeyboardFocusView.types";

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    { onFocusChange, style, focusStyle, canBeFocused = true, ...props },
    ref,
  ) => {
    const canBecomeFocused = useCanBeFocused();
    const setCurrentFocusTag = useCallback(
      (e: { nativeEvent: { target: number } }) => {
        A11yModule.currentFocusedTag = e?.nativeEvent?.target || undefined;
      },
      [],
    );

    const onFocus = useCallback<OnFocusChangeFn>(
      e => {
        setCurrentFocusTag(e as unknown as { nativeEvent: { target: number } });
        onFocusChange?.(e);
      },
      [onFocusChange, setCurrentFocusTag],
    );

    const { fStyle, onFocusChangeHandler } = useFocusStyle(focusStyle, onFocus);

    return (
      <NativeFocusWrapper
        ref={ref}
        style={[style, fStyle]}
        canBeFocused={canBecomeFocused && canBeFocused}
        onFocusChange={onFocusChangeHandler}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  },
);
