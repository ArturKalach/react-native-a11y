import type { ComponentType } from 'react';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Float,
  Int32,
} from 'react-native/Libraries/Types/CodegenTypes';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

/**
 * Merged native view backing `A11y.View` (and `A11y.Index`, `A11y.Pressable`).
 *
 * This is the **frozen contract** uniting the screen-reader view
 * (`A11yIndexView`, from react-native-a11y-order) and the physical-keyboard view
 * (`ExternalKeyboardView`, from react-native-external-keyboard). Steps 3–4
 * implement `RCA11yView` (iOS) / the Android view against it.
 *
 * Ordering: one engine selected by `orderType` (`auto|keyboard|screen-reader`);
 * `orderIndex` is shared and interpreted per `orderType`.
 */

// ─── Event payloads ─────────────────────────────────────────────────────────

/** Keyboard focus enter/leave. */
export type FocusChange = Readonly<{
  isFocused: boolean;
}>;

/** Screen-reader focus enter/leave on this element. */
export type ScreenReaderFocusChange = Readonly<{
  isFocused: boolean;
}>;

/** Screen-reader focus change on a descendant (carries the focused nativeId). */
export type ScreenReaderDescendantFocusChanged = Readonly<{
  status: string;
  nativeId?: string;
}>;

/** Physical key press (down / up). */
export type KeyPress = Readonly<{
  keyCode: Int32;
  unicode: Int32;
  unicodeChar: string;
  isLongPress: boolean;
  isAltPressed: boolean;
  isShiftPressed: boolean;
  isCtrlPressed: boolean;
  isCapsLockOn: boolean;
  hasNoModifiers: boolean;
}>;

// ─── Props (union of SR + keyboard) ─────────────────────────────────────────

export interface A11yViewNativeProps extends ViewProps {
  // Ordering — discriminator + shared
  /** Which ordering engine consumes the order props: 0 auto · 1 keyboard · 2 screen-reader. */
  orderType?: Int32;
  /** Shared order index; interpreted per `orderType`. */
  orderIndex?: Int32;
  /** Keyboard index-order group. */
  orderGroup?: string;
  /** Screen-reader sequence key (provided by an enclosing `A11y.Order`). */
  orderKey?: string;
  /** Which element receives focus: 0 self · 1 child · 2 subview (was `orderFocusType`). */
  focusTarget?: Int32;

  // Screen-reader
  /** iOS `shouldGroupAccessibilityChildren` (tri-state via Int32). */
  shouldGroupAccessibilityChildren?: Int32;
  /** iOS `UIAccessibilityContainerType`. */
  containerType?: Int32;
  descendantFocusChangedEnabled?: boolean;
  onScreenReaderFocused?: DirectEventHandler<{}>;
  onScreenReaderFocusChange?: DirectEventHandler<ScreenReaderFocusChange>;
  onScreenReaderDescendantFocusChanged?: DirectEventHandler<ScreenReaderDescendantFocusChanged>;

  // Keyboard focus + key events
  canBeFocused?: boolean;
  autoFocus?: boolean;
  hasKeyDownPress?: boolean;
  hasKeyUpPress?: boolean;
  hasOnFocusChanged?: boolean;
  onFocusChange?: DirectEventHandler<FocusChange>;
  onKeyDownPress?: DirectEventHandler<KeyPress>;
  onKeyUpPress?: DirectEventHandler<KeyPress>;
  onContextMenuPress?: DirectEventHandler<{}>;
  onBubbledContextMenuPress?: BubblingEventHandler<{}>;
  enableContextMenu?: boolean;

  // Keyboard styling (iOS halo / tint)
  haloEffect?: boolean;
  haloCornerRadius?: Float;
  haloExpendX?: Float;
  haloExpendY?: Float;
  roundedHaloFix?: boolean;
  tintColor?: ColorValue;

  // Keyboard grouping + auto-focus
  groupIdentifier?: string;
  screenAutoA11yFocus?: boolean;
  screenAutoA11yFocusDelay?: Int32;

  // Keyboard directional lock + link order
  lockFocus?: Int32;
  orderId?: string;
  orderLeft?: string;
  orderRight?: string;
  orderUp?: string;
  orderDown?: string;
  orderForward?: string;
  orderBackward?: string;
  orderFirst?: string;
  orderLast?: string;
}

// ─── Commands (merged focus handle) ─────────────────────────────────────────

export interface NativeCommands {
  /** Move both screen-reader and keyboard focus to this view. */
  // @ts-ignore
  focus: (viewRef: React.ElementRef<ComponentType>) => void;
  /** Move physical-keyboard focus to this view (was `rnekKeyboardFocus`). */
  // @ts-ignore
  keyboardFocus: (viewRef: React.ElementRef<ComponentType>) => void;
  /** Move screen-reader focus to this view (was `rnekScreenReaderFocus`). */
  // @ts-ignore
  screenReaderFocus: (viewRef: React.ElementRef<ComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['focus', 'keyboardFocus', 'screenReaderFocus'],
});

export default codegenNativeComponent<A11yViewNativeProps>('A11yView');
