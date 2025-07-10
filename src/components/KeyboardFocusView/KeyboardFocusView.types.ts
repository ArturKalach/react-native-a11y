import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import type { FocusWrapperProps, OnKeyPress } from './RCA11yFocusWrapper';

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;

export type KeyboardFocusViewProps = FocusWrapperProps & {
  focusStyle?: FocusStyle;
  onPress?: (e: GestureResponderEvent | OnKeyPress) => void;
  onLongPress?: (e: GestureResponderEvent | OnKeyPress) => void;

  /**
   * @platform android
   */
  withView?: boolean;
};
