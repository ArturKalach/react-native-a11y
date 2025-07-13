import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import type { NativeProps } from '../../nativeSpecs/A11yFocusWrapperNativeComponent';

export type FocusStateCallbackType = {
  readonly focused: boolean;
};

type NonNullable<T> = Exclude<T, null | undefined>;

export type OnFocusChangeFn = NativeProps['onFocusChange'];
export type OnKeyPressFn = NonNullable<
  NativeProps['onKeyUpPress'] | NativeProps['onKeyDownPress']
>;

export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;

export type KeyboardFocusViewProps = NativeProps & {
  focusStyle?: FocusStyle;
  onPress?: (e: GestureResponderEvent) => void | OnKeyPressFn;
  onLongPress?: (e: GestureResponderEvent) => void | OnKeyPressFn;

  /**
   * @platform android
   */
  withView?: boolean;
};
