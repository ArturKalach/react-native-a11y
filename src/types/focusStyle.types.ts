import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Interaction state passed to every `withKeyboardFocus` style callback
 * (`style`, `containerStyle`) — one consistent shape for both keyboard focus and
 * press, so `style={({ focused, pressed }) => …}` works everywhere.
 */
export type InteractionState = {
  readonly focused: boolean;
  readonly pressed: boolean;
};

/**
 * A style prop that is either a static style/array or a callback receiving the
 * current {@link InteractionState}.
 */
export type InteractiveStyleProp =
  | StyleProp<ViewStyle>
  | ((state: InteractionState) => StyleProp<ViewStyle>);

/** State passed to a {@link FocusStyle} callback. */
export type FocusStateCallbackType = {
  readonly focused: boolean;
};

/**
 * A style applied based on focus state: a static style, or a callback that
 * receives `{ focused }` and returns the style for the current state.
 *
 * @deprecated Prefer the unified `style` / `containerStyle` callback, which now
 * receives `{ focused, pressed }` — e.g. `style={(s) => (s.focused ? … : …)}`.
 */
export type FocusStyle =
  | StyleProp<ViewStyle>
  | ((state: FocusStateCallbackType) => StyleProp<ViewStyle>)
  | undefined;
