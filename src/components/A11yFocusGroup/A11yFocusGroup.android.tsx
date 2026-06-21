import React from 'react';
import A11yFocusGroupNative from '../../nativeSpecs/RCA11yFocusGroupNativeComponent';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { A11yFocusGroupProps } from './A11yFocusGroup.types';

export const A11yFocusGroup = React.memo<A11yFocusGroupProps>((props) => {
  const { containerFocusedStyle: focusStyle, onFocusChangeHandler } =
    useFocusStyle({
      onFocusChange: props.onFocusChange,
      containerFocusStyle: props.focusStyle,
    });

  const onGroupFocusChangeHandler = useOnFocusChange({
    ...props,
    onFocusChange: onFocusChangeHandler,
  });

  return (
    <A11yFocusGroupNative
      {...props}
      style={[props.style, focusStyle]}
      onGroupFocusChange={onGroupFocusChangeHandler}
    />
  );
});
