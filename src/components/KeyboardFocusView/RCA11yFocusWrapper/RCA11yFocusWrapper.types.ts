import type { NativeSyntheticEvent, ViewProps } from "react-native";

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;

export type OnKeyPress = NativeSyntheticEvent<{
  keyCode: number;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

export type OnKeyPressFn = (e: OnKeyPress) => void;
export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;

export type FocusWrapperProps = ViewProps & {
  onFocusChange?: OnFocusChangeFn;
  onKeyUpPress: OnKeyPressFn;
  onKeyDownPress: OnKeyPressFn;
  canBeFocused?: boolean;
};
