import type { NativeSyntheticEvent, ViewProps } from 'react-native';

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;

export type OnEnterPressEvent = NativeSyntheticEvent<{
  isShiftPressed: boolean;
  isAltPressed: boolean;
  isEnterPress: boolean;
}>;

export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;
export type OnEnterPressFn = (e: OnEnterPressEvent) => void;

export type FocusWrapperProps = ViewProps & {
  onFocusChange?: OnFocusChangeFn;
  canBeFocused?: boolean;
  /**
   * @platform android
   */
  onEnterPress?: OnEnterPressFn;
};
