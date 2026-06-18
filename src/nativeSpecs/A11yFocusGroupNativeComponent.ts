import type { ViewProps, ColorValue } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

/** iOS keyboard focus group backing `A11y.FocusGroup` (was `KeyboardFocusGroup`). */
export interface A11yFocusGroupNativeComponentProps extends ViewProps {
  onGroupFocusChange?: DirectEventHandler<FocusChange>;
  tintColor?: ColorValue;
  groupIdentifier?: string;
  orderGroup?: string;
}

export default codegenNativeComponent<A11yFocusGroupNativeComponentProps>(
  'A11yFocusGroup'
);
