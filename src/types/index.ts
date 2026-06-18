/**
 * Shared public types for the unified package.
 *
 * `OrderType` / `FocusTarget` encode the locked rework decisions; the remaining
 * modules are the keyboard/focus type layer ported from react-native-external-keyboard
 * (Step 2), retargeted at the merged `A11yView` native spec.
 */

/**
 * Which ordering system applies to a focus-aware view.
 * - `'auto'`          — apply to both screen reader and keyboard
 * - `'keyboard'`      — physical-keyboard focus order only
 * - `'screen-reader'` — VoiceOver / TalkBack traversal order only
 */
export type OrderType = 'auto' | 'keyboard' | 'screen-reader';

/**
 * Which element inside the wrapper actually receives focus.
 * Replaces the legacy `A11yIndex.orderType` (`default|child|subview`) and absorbs
 * the keyboard `focusableWrapper` boolean.
 * - `'self'`    — the wrapper view itself (was `'default'`)
 * - `'child'`   — the first accessible descendant
 * - `'subview'` — the first direct child view
 */
export type FocusTarget = 'self' | 'child' | 'subview';

/** @deprecated Use {@link FocusTarget}. Kept as an alias for migration. */
export type A11yOrderType = 'default' | 'child' | 'subview';

// ─── Ported keyboard/focus type layer ───────────────────────────────────────
export type { FocusStateCallbackType, FocusStyle } from './focusStyle.types';
export type {
  OnFocusChangeFn,
  KeyboardFocusHandle,
  KeyboardFocus,
  BaseKeyboardViewType,
  KeyboardFocusEvent,
  NativeFocusChangeHandler,
} from './focus.types';
export type { OnKeyPress, OnKeyPressFn } from './keyPress.types';
export {
  LockFocusEnum,
  type LockFocusType,
  type FocusOrderProps,
} from './focusOrder.types';
export type {
  CommonFocusProps,
  BaseFocusViewProps,
  BaseKeyboardViewProps,
} from './baseKeyboardView.types';
export type {
  FocusViewProps,
  KeyboardFocusViewProps,
} from './keyboardFocusView.types';
export type {
  ExtraKeyboardProps,
  KeyboardInputPropsDeclaration,
  KeyboardInputProps,
} from './keyboardInput.types';
export type {
  KeyboardFocusableComponent,
  KeyboardPressType,
  ChildrenRenderState,
  WithKeyboardProps,
  WithKeyboardFocusProps,
  WithKeyboardFocusPropsWithRef,
  KeyboardFocusableComponentDeclaration,
} from './withKeyboardFocus.types';
