import React from 'react';
import type { A11yLockProps } from './A11yLock.types';
import { A11yBaseLock } from './A11yBaseLock';
import { FrameProvider } from '../../context/FocusFrameProviderContext';

export const A11yFocusFrame = React.memo<A11yLockProps>(
  ({ lockDisabled = false, ...props }) => {
    return (
      <FrameProvider>
        <A11yBaseLock
          {...props}
          componentType={1}
          lockDisabled={lockDisabled}
        />
      </FrameProvider>
    );
  }
);
