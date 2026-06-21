import type { StyleProp, ViewStyle } from 'react-native';

/** State passed to a {@link FocusStyle} callback. */
export type FocusStateCallbackType = {
  readonly focused: boolean;
};

/**
 * A style applied based on focus state: a static style, or a callback that
 * receives `{ focused }` and returns the style for the current state.
 */
export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;
