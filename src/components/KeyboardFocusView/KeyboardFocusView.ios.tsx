import React, { useCallback } from 'react';
import type { View } from 'react-native';

import { useCanBeFocused } from '../../providers';
import { NativeFocusWrapper, type OnFocusChangeFn } from './RCA11yFocusWrapper';
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

    const onFocus = useCallback<OnFocusChangeFn>(
      (e) => {
        onFocusChange?.(e);
      },
      [onFocusChange]
    );

    const { fStyle, onFocusChangeHandler } = useFocusStyle(focusStyle, onFocus);

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
