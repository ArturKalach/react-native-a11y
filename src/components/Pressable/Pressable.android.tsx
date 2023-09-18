/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React from "react";
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  View,
} from "react-native";
import {
  KeyboardFocusView,
  KeyboardFocusViewProps,
  OnKeyPressFn,
} from "../KeyboardFocusView";

const ANDROID_SPACE_KEY_CODE = 62;

export const Pressable = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyDownPress,
      ...props
    },
    ref,
  ) => {
    const onKeyUpPressHandler = React.useCallback<OnKeyPressFn>(
      e => {
        const {
          nativeEvent: { keyCode, isLongPress },
        } = e;

        if (keyCode === ANDROID_SPACE_KEY_CODE) {
          if (isLongPress) {
            onLongPress?.(e);
          } else {
            onPress?.(e);
          }
        }
      },
      [onLongPress, onPress],
    );

    const onPressablePressHandler = (event: GestureResponderEvent) => {
      if (event.nativeEvent.identifier !== undefined) {
        onPress?.(event);
      }
    };

    return (
      <KeyboardFocusView
        style={style}
        focusStyle={focusStyle}
        ref={ref}
        withView={false}
        onKeyUpPress={onKeyUpPressHandler}
        onKeyDownPress={onKeyDownPress}
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
      >
        <RNPressable
          onPress={onPressablePressHandler}
          onLongPress={onLongPress}
          {...props}
        />
      </KeyboardFocusView>
    );
  },
);
