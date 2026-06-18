import React from 'react';
import A11yLockNativeComponent from '../../nativeSpecs/A11yLockNativeComponent';
import type { A11yLockProps } from './A11yLock.types';

export const A11yBaseLock = React.memo<A11yLockProps>(
  ({
    lockDisabled = false,
    componentType = 0,
    forceLock = false,
    ...props
  }) => {
    return (
      <A11yLockNativeComponent
        {...props}
        containerKey="is-not-needed"
        componentType={componentType}
        lockDisabled={lockDisabled}
        forceLock={forceLock}
      />
    );
  }
);
