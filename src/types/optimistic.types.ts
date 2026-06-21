/**
 * iOS-only optimistic accessibility values. On iOS, VoiceOver reads an
 * element's `accessibilityValue`/state immediately after an action — before
 * React re-renders — so it announces the stale value. Supplying `optimistic`
 * makes the element announce the predicted value for the brief window between
 * the action and the next props update. Each field is a static snapshot taken
 * at action time; absence of the whole object disables the behavior.
 *
 * Targeting follows `screenReaderFocusTarget`/`focusableWrapper`: in `self`
 * mode the prediction applies to the view itself; in wrapper mode it applies to
 * the inner focused element (this is how `A11y.Pressable` / `A11y.Input` use it,
 * since they wrap their inner component in a focusable `A11y.View`).
 *
 * Note: `increase`/`decrease` only change what is announced — the element must
 * still carry the Adjustable trait and real `accessibilityActions` to step.
 *
 * @platform ios
 */
export type A11yOptimisticConfig = {
  /** Announced after VoiceOver triggers increment (swipe up on an adjustable). */
  increase?: string;
  /** Announced after VoiceOver triggers decrement (swipe down on an adjustable). */
  decrease?: string;
  /** Announced after activate (double-tap). Takes precedence over `state`. */
  activate?: string;
  /**
   * Predicted next `checked` value for checkbox/switch/radio toggles, announced
   * role-aware (checkbox/radio → "checked"/"unchecked", switch → "on"/"off").
   * Used on activate when `activate` is not provided.
   */
  state?: boolean;
};
