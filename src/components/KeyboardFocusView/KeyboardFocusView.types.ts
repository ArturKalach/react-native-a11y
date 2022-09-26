import type { StyleProp, ViewStyle } from "react-native";
import type { FocusWrapperProps } from "./RCA11yFocusWrapper";

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;

export type KeyboardFocusViewProps = FocusWrapperProps & {
  focusStyle?: FocusStyle;

  /**
   * @platform android
   */
  withView?: boolean;
};
