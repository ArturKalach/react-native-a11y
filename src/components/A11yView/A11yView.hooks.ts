import React, { useContext, useMemo } from 'react';
import { useKeyPressContext } from '../../context/BubbledKeyPressContext';
import { A11ySequenceOrderContext } from '../../context/A11ySequenceOrderContext';
import type {
  A11yOptimisticConfig,
  ScreenReaderFocusTarget,
} from '../../types';
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

// Native focusTarget Int32: 0 self · 1 first-accessible (deep) · 2 first child (shallow).
const FOCUS_TARGET_VALUE: Record<ScreenReaderFocusTarget, number> = {
  self: 0,
  firstAccessible: 1,
  child: 2,
};

/**
 * Resolves the native `focusTarget` Int32. When `screenReaderFocusTarget` is
 * unset, a keyboard `focusableWrapper` makes the view a transparent wrapper, so
 * the SR target falls back to the first accessible descendant.
 */
export const resolveFocusTarget = (
  screenReaderFocusTarget: ScreenReaderFocusTarget | undefined,
  focusableWrapper: boolean | undefined
): number | undefined => {
  const resolved =
    screenReaderFocusTarget ??
    (focusableWrapper ? 'firstAccessible' : undefined);
  return resolved ? FOCUS_TARGET_VALUE[resolved] : undefined;
};

/**
 * Flattens the iOS-only `optimistic` object into the scalar native props
 * (`A11yViewNativeComponent`). `state` becomes a tri-state Int32 so an unset
 * value (0) is distinguishable from an explicit `false` (1).
 */
export const resolveOptimisticProps = (
  optimistic: A11yOptimisticConfig | undefined
) => ({
  optimisticIncrease: optimistic?.increase,
  optimisticDecrease: optimistic?.decrease,
  optimisticActivate: optimistic?.activate,
  optimisticState:
    optimistic?.state === undefined ? 0 : optimistic.state ? 2 : 1,
});
