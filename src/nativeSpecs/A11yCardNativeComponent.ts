import type { ViewProps } from 'react-native';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/** Native card backing `A11y.Card` (iOS focusable overlay; Android is JS-only). */
export interface A11yCardNativeComponentProps extends ViewProps {}

export default codegenNativeComponent<A11yCardNativeComponentProps>('A11yCard');
