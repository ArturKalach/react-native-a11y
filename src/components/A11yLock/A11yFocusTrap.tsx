import { View } from 'react-native';
import type { A11yFocusTrapProps } from './A11yLock.types';
import { A11yFocusTrapMountWrapper } from './A11yFocusTrapMountWrapper';
import { A11yBaseLock } from './A11yBaseLock';

export const A11yFocusTrap = ({
  forceLock = false,
  ...props
}: A11yFocusTrapProps) => {
  if (forceLock) {
    return (
      <A11yFocusTrapMountWrapper>
        <A11yBaseLock
          collapsable={false}
          accessibilityViewIsModal={true}
          forceLock={forceLock}
          {...props}
        />
      </A11yFocusTrapMountWrapper>
    );
  }

  return (
    <A11yFocusTrapMountWrapper>
      <View collapsable={false} accessibilityViewIsModal={true} {...props} />
    </A11yFocusTrapMountWrapper>
  );
};
