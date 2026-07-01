/**
 * Shared public types for the unified package.
 *
 * `OrderType` / `ScreenReaderFocusTarget` encode the locked rework decisions; the remaining
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
 * Which element the **screen reader** treats as this view's focus / traversal
 * node. Drives the SR order target only (the keyboard side has its own
 * `focusableWrapper`).
 * - `'self'`           — the view itself (default)
 * - `'firstAccessible'`— the first accessible descendant, searched depth-first.
 *   This is the default for wrapper components (see `focusableWrapper`).
 * - `'child'`          — the first direct child view, no deep search (legacy
 *   "subview" behavior)
 */
export type ScreenReaderFocusTarget = 'self' | 'firstAccessible' | 'child';

/** @deprecated Use {@link ScreenReaderFocusTarget}. */
export type FocusTarget = ScreenReaderFocusTarget;

/** @deprecated Use {@link ScreenReaderFocusTarget}. Kept as an alias for migration. */
export type A11yOrderType = 'default' | 'child' | 'subview';

// ─── Ported keyboard/focus type layer ───────────────────────────────────────
export type {
  FocusStateCallbackType,
  FocusStyle,
  InteractionState,
  InteractiveStyleProp,
} from './focusStyle.types';
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
export type { A11yOptimisticConfig } from './optimistic.types';
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
  ContainerStyle,
  ContainerStyleStateType,
} from './withKeyboardFocus.types';
