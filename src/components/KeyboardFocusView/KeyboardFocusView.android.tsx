import React from 'react';
import { View } from 'react-native';
import { useFocusStyle } from '../../hooks';
import NativeFocusWrapper from '../../nativeSpecs/A11yFocusWrapperNativeComponent';
import { useCanBeFocused } from '../../providers';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  (
    {
      canBeFocused,
      onFocusChange,
      focusStyle,
      children,
      style,
      withView = true,
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
        onFocusChange={onFocusChangeHandler}
        style={[style, fStyle]}
        canBeFocused={canBecomeFocused && canBeFocused}
        ref={ref}
        onKeyUpPress={onKeyUpPress}
        onKeyDownPress={onKeyDownPress}
        {...props}
      >
        {withView ? <View accessible>{children}</View> : children}
      </NativeFocusWrapper>
    );
  }
);
