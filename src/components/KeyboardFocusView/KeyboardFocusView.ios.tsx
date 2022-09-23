import React, { useCallback } from 'react';
import type { View } from 'react-native';

import { useCanBeFocused } from '../../providers';
import { NativeFocusWrapper } from './RCA11yFocusWrapper';
import { A11yModule } from '../../modules';
import type { KeyboardFocusViewProps } from './KeyboardFocusView.types';

export const KeyboardFocusView = React.forwardRef<View, KeyboardFocusViewProps>(
  ({ onFocusChange, canBeFocused = true, ...props }, ref) => {
    const canBecomeFocused = useCanBeFocused()
    const setCurrentFocusTag = useCallback(e => {
        A11yModule.currentFocusedTag = e?.nativeEvent?.target || undefined;
    }, []);

    const onFocusChangeHandler = useCallback(
      e => {
        setCurrentFocusTag(e);
        onFocusChange?.(e);
      },
      [onFocusChange, setCurrentFocusTag],
    );

    return (
      <NativeFocusWrapper
        ref={ref}
        canBeFocused={canBecomeFocused && canBeFocused}
        onFocusChange={onFocusChangeHandler}
        {...props}
      />
    );
  },
);
