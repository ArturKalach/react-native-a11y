import React from 'react';
import type { View } from 'react-native';

import { useCanBeFocused } from '../../providers';
import NativeFocusWrapper from '../../nativeSpecs/A11yFocusWrapperNativeComponent';
import { useFocusStyle } from '../../hooks';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      onFocusChange,
      style,
      focusStyle,
      canBeFocused = true,
      onKeyUpPress,
      onKeyDownPress,
      ...props
    },
    ref
  ) => {
    const canBecomeFocused = useCanBeFocused();

    const { fStyle, onFocusChangeHandler } = useFocusStyle(
      focusStyle,
      onFocusChange
    );

    return (
      <NativeFocusWrapper
        ref={ref}
        style={[style, fStyle]}
        canBeFocused={canBecomeFocused && canBeFocused}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        onFocusChange={onFocusChangeHandler}
        {...props}
      />
    );
  }
);
