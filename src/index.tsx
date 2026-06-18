/**
 * react-native-a11y — unified entry point.
 *
 * Everything is exposed under a single `A11y` namespace, with imperative APIs,
 * hooks, providers, and the keyboard-focus HOC at top level. See the
 * `REWORK_*.md` plan at the workspace root.
 */

import { A11yView } from './components/A11yView';
import { A11yIndex } from './components/A11yIndex';
import { A11yOrder } from './components/A11yOrder';
import { A11yPressable } from './components/A11yPressable';
import { A11yInput } from './components/A11yInput';
import { A11yCard } from './components/A11yCard';
import { A11yFocusTrap, A11yFocusFrame } from './components/A11yLock';
import { A11yPaneTitle, A11yScreenChange } from './components/A11yPaneTitle';
import { A11yFocusGroup } from './components/A11yFocusGroup';

// ─── Single `A11y` namespace ────────────────────────────────────────────────
export const A11y = {
  View: A11yView,
  Pressable: A11yPressable,
  Input: A11yInput,
  Order: A11yOrder,
  Index: A11yIndex,
  Card: A11yCard,
  FocusTrap: A11yFocusTrap,
  FocusFrame: A11yFocusFrame,
  PaneTitle: A11yPaneTitle,
  ScreenChange: A11yScreenChange,
  FocusGroup: A11yFocusGroup,
};

// ─── Top-level imperative APIs ──────────────────────────────────────────────
export {
  announce,
  cancel,
  cancelAll,
  ScreenReader,
  Keyboard,
  isKeyboardConnected,
  keyboardStatusListener,
  type StatusCallback,
  type AnnouncePriority,
  type AnnounceStatus,
  type AnnounceOptions,
  type AnnouncementResult,
} from './modules';
export { A11yProvider } from './providers';
export {
  combineRefs,
  withKeyboardFocus,
  isScreenReaderEnabled,
  screenReaderStatusListener,
  useIsScreenReaderEnabled,
  useIsScreenReaderEnabledRef,
  useIsKeyboardConnected,
  useIsKeyboardConnectedRef,
} from './utils';

// ─── Legacy 0.7 imperative focus-order API (migration shim) ──────────────────
export { Legacy } from './legacy';

// ─── Context (focus group / focus state) ────────────────────────────────────
export {
  useIsViewFocused,
  KeyboardOrderFocusGroup,
  useOrderFocusGroup,
  OrderFocusGroupContext,
} from './context';

// ─── Public types ───────────────────────────────────────────────────────────
export * from './types';
export type { KeyPress } from './nativeSpecs/A11yViewNativeComponent';
export type {
  A11yViewProps,
  A11yUIContainerType,
  ScreenReaderCallbacks,
  ScreenReaderDescendantFocusChangedEvent,
} from './components/A11yView';
export type { A11yPressableProps } from './components/A11yPressable';
export type { A11yInputProps } from './components/A11yInput';
export type {
  A11yCardProps,
  A11yCardAccessibilityProps,
} from './components/A11yCard';
export type {
  A11yFocusTrapProps,
  A11yFocusFrameProps,
} from './components/A11yLock';
export type {
  A11yPaneTitleProps,
  A11yScreenChangeProps,
  A11yPaneType,
} from './components/A11yPaneTitle';
export type { A11yFocusGroupProps } from './components/A11yFocusGroup';
export type { A11yOrderProps } from './components/A11yOrder';
export type { A11yIndexProps } from './components/A11yIndex';

// ─── Deprecated aliases (migration from the split packages / 0.7) ────────────
/** @deprecated Use `A11y.Input`. */
export const KeyboardFocusTextInput = A11yInput;
/** @deprecated Use `A11y.FocusFrame` / `A11y.FocusTrap`. */
export const Focus = { Frame: A11yFocusFrame, Trap: A11yFocusTrap };
/** @deprecated Use `A11y.Input` / `A11y.View` / `A11y.Pressable`. */
export const K = {
  Input: A11yInput,
  View: A11yView,
  Pressable: A11yPressable,
};
