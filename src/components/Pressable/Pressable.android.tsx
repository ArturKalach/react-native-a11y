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
import { Pressable as RNPressable, View } from "react-native";
import {
  KeyboardFocusView,
  KeyboardFocusViewProps,
} from "../KeyboardFocusView";

export const Pressable = React.forwardRef<View, KeyboardFocusViewProps>(
  ({ canBeFocused, focusStyle, style, onFocusChange, ...props }, ref) => {
    return (
      <KeyboardFocusView
        style={style}
        focusStyle={focusStyle}
        ref={ref}
        withView={false}
        canBeFocused={canBeFocused}
        onFocusChange={onFocusChange}
      >
        <RNPressable {...props} />
      </KeyboardFocusView>
    );
  },
);
