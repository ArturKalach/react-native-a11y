import type { ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/**
 * Merged native lock backing `A11y.FocusTrap` / `A11y.FocusFrame` — unites the
 * screen-reader lock (`A11yLock`, react-native-a11y-order) and the keyboard lock
 * (`ExternalKeyboardLockView`, react-native-external-keyboard) into one view.
 */
export interface A11yLockNativeComponentProps extends ViewProps {
  /** 0 = Trap (containment), 1 = Frame (leak detection). */
  componentType: Int32;
  /** Screen-reader container key (from `A11yLock`). */
  containerKey?: string;
  lockDisabled?: boolean;
  forceLock?: boolean;
}

export default codegenNativeComponent<A11yLockNativeComponentProps>('A11yLock');
