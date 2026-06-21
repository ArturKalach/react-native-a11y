import { AccessibilityInfo } from 'react-native';
import NativeA11yKeyboardModule from '../nativeSpecs/NativeRCA11yKeyboardModule';

/**
 * Legacy 0.7 imperative focus helpers (tag-based). Wrap a `ref` with
 * `findNodeHandle(ref.current)` to get a `nativeTag` when migrating from the old
 * ref-based `A11yModule` API.
 */

/** Move screen-reader (VoiceOver/TalkBack) focus to the view. */
export const setAccessibilityFocus = (nativeTag: number): void => {
  if (Number.isInteger(nativeTag)) {
    AccessibilityInfo.setAccessibilityFocus(nativeTag);
  }
};

/** Move physical-keyboard focus to the view (and force a focus update). */
export const setKeyboardFocus = (nativeTag: number): void => {
  if (Number.isInteger(nativeTag)) {
    NativeA11yKeyboardModule?.setKeyboardFocus(nativeTag);
  }
};

/** Mark the view as the preferred keyboard-focus target (no forced update). */
export const setPreferredKeyboardFocus = (nativeTag: number): void => {
  if (Number.isInteger(nativeTag)) {
    NativeA11yKeyboardModule?.setPreferredKeyboardFocus(nativeTag);
  }
};
