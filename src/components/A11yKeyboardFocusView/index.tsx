import React, { useMemo } from 'react';
import { Platform, type View } from 'react-native';
import type { KeyboardFocusViewProps, KeyboardFocus } from '../../types';
import { A11yView } from '../A11yView';
import { useKeyboardFocusContainer } from '../../utils/useKeyboardFocusContainer';
import { IsViewFocusedContext } from '../../context/IsViewFocusedContext';

/**
 * Syntax sugar over `A11y.View` for the common "make this view focusable and
 * style it on focus" case: built-in `focusStyle` plus optional keyboard
 * `onPress` / `onLongPress` (via `triggerCodes`), so you don't wire focus state
 * yourself. Exposes the focus state to descendants through `IsViewFocusedContext`
 * (`useIsViewFocused`).
 *
 * A simple entry point for basic focusable views when you don't need a
 * pressable. Drop down to `A11y.View` for full manual control, or use
 * `A11y.Pressable` for real press/button semantics. Also keeps existing
 * react-native-external-keyboard `KeyboardFocusView` / `KeyboardExtendedView`
 * code working after switching to `react-native-a11y`.
 */
export const A11yKeyboardFocusView = React.forwardRef<
  KeyboardFocus | View,
  KeyboardFocusViewProps
>(
  (
    {
      autoFocus,
      focusStyle,
      style,
      onFocusChange,
      onPress,
      onLongPress,
      onKeyUpPress,
      onKeyDownPress,
      focusableWrapper = false,
      haloEffect = true,
      focusable,
      withView = true,
      tintColor,
      onFocus,
      onBlur,
      children,
      accessible,
      triggerCodes,
      defaultFocusHighlightEnabled = true,
      ...props
    },
    ref
  ) => {
    const {
      focused,
      containerFocusedStyle,
      onFocusChangeHandler,
      onKeyUpPressHandler,
      onKeyDownPressHandler,
    } = useKeyboardFocusContainer({
      onFocusChange,
      containerFocusStyle: focusStyle,
      onKeyUpPress,
      onKeyDownPress,
      onPress,
      onLongPress,
      triggerCodes,
    });

    const a11y =
      (Platform.OS === 'android' && withView && accessible !== false) ||
      accessible;

    const containerStyleArr = useMemo(
      () => [style, containerFocusedStyle],
      [style, containerFocusedStyle]
    );

    return (
      <IsViewFocusedContext.Provider value={focused}>
        <A11yView
          style={containerStyleArr}
          ref={ref}
          onKeyUpPress={onKeyUpPressHandler}
          onKeyDownPress={onKeyDownPressHandler}
          onFocus={onFocus}
          onBlur={onBlur}
          onFocusChange={onFocusChangeHandler}
          onContextMenuPress={onLongPress}
          haloEffect={haloEffect}
          defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
          autoFocus={autoFocus}
          focusable={focusable}
          tintColor={tintColor}
          focusableWrapper={focusableWrapper}
          accessible={a11y}
          enableContextMenu={Boolean(onLongPress)}
          {...props}
        >
          {children}
        </A11yView>
      </IsViewFocusedContext.Provider>
    );
  }
);
