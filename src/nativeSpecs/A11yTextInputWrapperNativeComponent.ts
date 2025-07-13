import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { HostComponent, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type OnTextFocusChange = DirectEventHandler<FocusChange>;

export interface A11yTextInputWrapperNativeComponent extends ViewProps {
  onFocusChange?: OnTextFocusChange;
  focusType?: Int32;
  blurType?: Int32;
  canBeFocused?: boolean;
}

export default codegenNativeComponent<A11yTextInputWrapperNativeComponent>(
  'RCA11yTextInputWrapper'
) as HostComponent<A11yTextInputWrapperNativeComponent>;
