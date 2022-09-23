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
import { Pressable as RNPressable } from "react-native";
import {
  KeyboardFocusView,
  KeyboardFocusViewProps,
} from "../KeyboardFocusView";

export const Pressable: React.FC<KeyboardFocusViewProps> = React.forwardRef(
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
        <RNPressable
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      </KeyboardFocusView>
    );
  },
);
