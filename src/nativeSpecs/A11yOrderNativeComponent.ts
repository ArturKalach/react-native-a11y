import type { ViewProps } from 'react-native';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/** Screen-reader order container backing `A11y.Order`. Provides `orderKey`. */
export interface A11yOrderNativeComponentProps extends ViewProps {
  orderKey: string;
}

export default codegenNativeComponent<A11yOrderNativeComponentProps>(
  'A11yOrder'
);
