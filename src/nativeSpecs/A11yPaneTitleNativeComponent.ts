import type { ViewProps } from 'react-native';
import type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/** Native pane/announcement backing `A11y.PaneTitle` / `A11y.ScreenChange`. */
export interface A11yPaneTitleProps extends ViewProps {
  title?: string;
  detachMessage?: string;
  /** 0 = activity · 1 = pane · 2 = announce. */
  type: Int32;
  withFocusRestore?: boolean;
}

export default codegenNativeComponent<A11yPaneTitleProps>('A11yPaneTitle');
