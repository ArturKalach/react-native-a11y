import React from 'react';
import A11yFocusGroupNative from '../../nativeSpecs/RCA11yFocusGroupNativeComponent';
import { GroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useFocusStyle } from '../../utils/useFocusStyle';
import type { A11yFocusGroupProps } from './A11yFocusGroup.types';

export const A11yFocusGroup = React.memo<A11yFocusGroupProps>((props) => {
  const { groupIdentifier } = props;

  const { containerFocusedStyle: focusStyle, onFocusChangeHandler } =
    useFocusStyle({
      onFocusChange: props.onFocusChange,
      containerFocusStyle: props.focusStyle,
    });

  const onGroupFocusChangeHandler = useOnFocusChange({
    ...props,
    onFocusChange: onFocusChangeHandler,
  });

  if (!groupIdentifier)
    return (
      <A11yFocusGroupNative
        {...props}
        style={[props.style, focusStyle]}
        onGroupFocusChange={onGroupFocusChangeHandler}
      />
    );

  return (
    <GroupIdentifierContext.Provider value={groupIdentifier}>
      <A11yFocusGroupNative
        {...props}
        style={[props.style, focusStyle]}
        onGroupFocusChange={onGroupFocusChangeHandler}
      />
    </GroupIdentifierContext.Provider>
  );
});
