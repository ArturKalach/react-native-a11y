import React from 'react';
import type { A11yLockProps } from './A11yLock.types';
import { A11yBaseLock } from './A11yBaseLock';
import { A11yFocusTrapMountWrapper } from './A11yFocusTrapMountWrapper';

export const A11yFocusTrap = React.memo<A11yLockProps>(
  ({ lockDisabled = false, ...props }) => (
    <A11yFocusTrapMountWrapper>
      <A11yBaseLock {...props} componentType={0} lockDisabled={lockDisabled} />
    </A11yFocusTrapMountWrapper>
  )
);
