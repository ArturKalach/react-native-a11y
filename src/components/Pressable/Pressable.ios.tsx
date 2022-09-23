/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import { useMemo, useState, useRef, useImperativeHandle } from 'react';
import type { GestureResponderEvent, PressableProps, View } from 'react-native';
// @ts-ignore
import { normalizeRect } from 'react-native/Libraries/StyleSheet/Rect';
// @ts-ignore
import usePressability from 'react-native/Libraries/Pressability/usePressability';
// @ts-ignore
import useAndroidRippleForView from 'react-native/Libraries/Components/Pressable/useAndroidRippleForView';

import { KeyboardFocusView } from 'react-native-a11y';
import type { KeyboardFocusViewProps } from '../KeyboardFocusView';

type Props = PressableProps & KeyboardFocusViewProps & {
  unstable_pressDelay?: number;
};

export const Pressable =
  React.memo(
    React.forwardRef<View, Props>((props, forwardedRef) => {
      const {
        accessible,
        android_ripple,
        android_disableSound,
        cancelable,
        children,
        delayLongPress,
        disabled,
        focusable,
        onLongPress,
        onPress,
        onPressIn,
        onPressOut,
        pressRetentionOffset,
        style,
        testOnly_pressed,
        unstable_pressDelay,
        ...restProps
      } = props;

      const viewRef = useRef<React.ElementRef<typeof View>>(null);
      const android_rippleConfig = useAndroidRippleForView(
        android_ripple,
        viewRef,
      );

      useImperativeHandle(forwardedRef, () => viewRef.current as View);
      const [pressed, setPressed] = usePressState(testOnly_pressed === true);

      const hitSlop = normalizeRect(props?.hitSlop);

      const accessibilityState =
        disabled != null
          ? { ...props.accessibilityState, disabled }
          : props.accessibilityState;

      const restPropsWithDefaults = {
        ...restProps,
        ...android_rippleConfig?.viewProps,
        accessible: accessible !== false,
        accessibilityState,
        focusable: focusable !== false,
        hitSlop,
      };

      const config = useMemo(
        () => ({
          cancelable,
          disabled,
          hitSlop,
          pressRectOffset: pressRetentionOffset,
          android_disableSound,
          delayLongPress,
          delayPressIn: unstable_pressDelay,
          onLongPress,
          onPress,
          onPressIn(event: GestureResponderEvent): void {
            if (android_rippleConfig != null) {
              android_rippleConfig.onPressIn(event);
            }
            setPressed(true);
            if (onPressIn != null) {
              onPressIn(event);
            }
          },
          onPressMove: android_rippleConfig?.onPressMove,
          onPressOut(event: GestureResponderEvent): void {
            if (android_rippleConfig != null) {
              android_rippleConfig.onPressOut(event);
            }
            setPressed(false);
            if (onPressOut != null) {
              onPressOut(event);
            }
          },
        }),
        [
          android_disableSound,
          android_rippleConfig,
          cancelable,
          delayLongPress,
          disabled,
          hitSlop,
          onLongPress,
          onPress,
          onPressIn,
          onPressOut,
          pressRetentionOffset,
          setPressed,
          unstable_pressDelay,
        ],
      );
      const eventHandlers = usePressability(config);

      return (
        <KeyboardFocusView
          {...restPropsWithDefaults}
          {...eventHandlers}
          ref={viewRef}
          style={typeof style === 'function' ? style({ pressed }) : style}
          collapsable={false}
        >
          {typeof children === 'function' ? children({ pressed }) : children}
        </KeyboardFocusView>
      );
    }),
  );

function usePressState(
  forcePressed: boolean,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [pressed, setPressed] = useState(false);
  return [pressed || forcePressed, setPressed];
}
