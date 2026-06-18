import React, { useContext, useMemo } from 'react';
import { useKeyPressContext } from '../../context/BubbledKeyPressContext';
import { A11ySequenceOrderContext } from '../../context/A11ySequenceOrderContext';
import type { FocusTarget } from '../../types';
import type { ScreenReaderCallbacks } from './A11yView.types';

const bubbleStub = () => {};

/** Mirrors react-native-external-keyboard's `useBubbledInfo`. */
export const useBubbledInfo = (onBubbledContextMenuPress?: () => void) => {
  const keyPressContext = useKeyPressContext();

  const context = useMemo(
    () => ({
      bubbledMenu:
        Boolean(onBubbledContextMenuPress) || keyPressContext.bubbledMenu,
    }),
    [keyPressContext.bubbledMenu, onBubbledContextMenuPress]
  );

  const contextMenu = context.bubbledMenu
    ? onBubbledContextMenuPress ?? bubbleStub
    : undefined;

  return { contextMenu, context };
};

/** Mirrors react-native-a11y-order's screen-reader sub-view callback mapping. */
export const useScreenReaderProps = ({
  onScreenReaderFocused,
  onScreenReaderSubViewFocusChange,
  onScreenReaderSubViewFocused,
  onScreenReaderSubViewBlurred,
  onScreenReaderDescendantFocusChanged,
}: ScreenReaderCallbacks) => {
  const hasHandler = Boolean(
    onScreenReaderSubViewBlurred ||
      onScreenReaderSubViewFocused ||
      onScreenReaderSubViewFocusChange
  );

  const onScreenReaderFocusChange = React.useCallback(
    (event: { nativeEvent: { isFocused: boolean } }) => {
      const { isFocused } = event.nativeEvent;
      onScreenReaderSubViewFocusChange?.(isFocused);
      if (isFocused) {
        onScreenReaderSubViewFocused?.();
      } else {
        onScreenReaderSubViewBlurred?.();
      }
    },
    [
      onScreenReaderSubViewFocusChange,
      onScreenReaderSubViewBlurred,
      onScreenReaderSubViewFocused,
    ]
  );

  return {
    onScreenReaderFocused,
    onScreenReaderFocusChange: hasHandler
      ? onScreenReaderFocusChange
      : undefined,
    descendantFocusChangedEnabled: Boolean(
      onScreenReaderDescendantFocusChanged
    ),
    onScreenReaderDescendantFocusChanged,
  };
};

/**
 * Resolves the screen-reader sequence key from `A11y.Order` context.
 * Throws if a positional `index` is used outside an `A11y.Order`.
 */
export const useSequenceOrderKey = (index: number | undefined) => {
  const orderKey = useContext(A11ySequenceOrderContext);
  const hasOrderInfo = typeof index === 'number' || !!orderKey;

  if (hasOrderInfo && !orderKey) {
    throw new Error(
      '<A11y.Index> element should be used inside of an <A11y.Order> container'
    );
  }

  return { orderKey, hasOrderInfo };
};

const FOCUS_TARGET_VALUE: Record<FocusTarget, number> = {
  self: 0,
  child: 1,
  subview: 2,
};

/**
 * Resolves the `focusTarget` Int32 for native. Honors the deprecated
 * `focusableWrapper` boolean (a transparent wrapper ⇒ focus a child).
 */
export const resolveFocusTarget = (
  focusTarget: FocusTarget | undefined,
  focusableWrapper: boolean | undefined
): number | undefined => {
  const resolved = focusTarget ?? (focusableWrapper ? 'child' : undefined);
  return resolved ? FOCUS_TARGET_VALUE[resolved] : undefined;
};
