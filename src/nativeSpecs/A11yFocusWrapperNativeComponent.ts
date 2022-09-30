import type { HostComponent, ViewProps } from "react-native";
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";
import { BubblingEventHandler } from "react-native/Libraries/Types/CodegenTypes";

// export type KeyboardFocusEvent = DirectEventHandler<{
//   isFocused: boolean;
// }>;

// export type OnEnterPressEvent = NativeSyntheticEvent<{
//   isShiftPressed: boolean;
//   isAltPressed: boolean;
//   isEnterPress: boolean;
// }>;

export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

export type EnterPress = Readonly<{
  isShiftPressed: boolean;
  isAltPressed: boolean;
  isEnterPress: boolean;
}>;

export interface NativeProps extends ViewProps {
  onFocusChange?: BubblingEventHandler<FocusChange>;
  onEnterPress?: BubblingEventHandler<EnterPress>;
  canBeFocused?: boolean;
}

export default codegenNativeComponent<NativeProps>(
  "RCA11yFocusWrapper",
) as HostComponent<NativeProps>;
