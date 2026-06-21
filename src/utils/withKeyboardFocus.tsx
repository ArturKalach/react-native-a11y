import React, { type RefObject, useMemo } from 'react';
import { Pressable as RNPressable, View, type ViewProps } from 'react-native';
import { A11yView } from '../components/A11yView';
import type {
  BaseKeyboardViewType,
  KeyboardPressType,
  OnKeyPress,
  WithKeyboardFocusProps,
  KeyboardFocusableComponent,
} from '../types';
import { useKeyboardFocusContainer } from './useKeyboardFocusContainer';
import { useRenderedChildren } from './useRenderedChildren';
import { IsViewFocusedContext } from '../context/IsViewFocusedContext';

/**
 * HOC that adds unified keyboard + a11y focus to a Pressable-like component.
 * Renders the merged `A11yView` as the focus host and threads press/focus/order
 * props through it. Ported from react-native-external-keyboard, retargeted at the
 * merged native view.
 */
export const withKeyboardFocus = <
  ComponentProps extends object,
  ViewStyleType,
  ViewType = View
>(
  Component: KeyboardFocusableComponent<ComponentProps>
) => {
  const WithKeyboardFocus = React.memo(
    React.forwardRef<
      BaseKeyboardViewType | View,
      WithKeyboardFocusProps<ComponentProps, ViewStyleType, ViewType>
    >((allProps, ref) => {
      const {
        focusStyle,
        style,
        containerStyle,
        containerFocusStyle,
        withPressedStyle = false,
        onPress,
        onLongPress,
        onKeyUpPress,
        onKeyDownPress,
        onPressIn,
        onPressOut,
        triggerCodes,
        autoFocus,
        focusableWrapper = true,
        haloEffect = true,
        focusable = true,
        tintColor,
        onFocus,
        onBlur,
        onFocusChange,
        groupIdentifier,
        haloCornerRadius,
        haloExpendX,
        haloExpendY,
        screenAutoA11yFocus,
        screenAutoA11yFocusDelay,
        lockFocus,
        defaultFocusHighlightEnabled,
        optimistic,
        androidKeyboardPressState,
        orderIndex,
        orderGroup,
        orderId,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        componentRef,
        onComponentFocus,
        onComponentBlur,
        renderContent,
        renderFocusable,
        roundedHaloFix,
        tintType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        enableA11yFocus: _enableA11yFocus,
        children: userChildren,
        ...props
      } = allProps as WithKeyboardFocusProps<ComponentProps, ViewStyleType> & {
        children?: React.ReactNode;
      };

      const {
        focused,
        keyboardPressed,
        containerFocusedStyle,
        componentStyleViewStyle,
        onFocusChangeHandler,
        onKeyUpPressHandler,
        onKeyDownPressHandler,
        onPressHandler,
        onContextMenuHandler,
        enableContextMenu,
      } = useKeyboardFocusContainer({
        onFocusChange,
        focusStyle,
        containerFocusStyle,
        style,
        pressedStyleSignature:
          withPressedStyle ||
          (Component as unknown) === (RNPressable as unknown),
        onKeyUpPress,
        onKeyDownPress,
        onPress: onPress as (e?: OnKeyPress) => void,
        onLongPress: onLongPress as (e?: OnKeyPress) => void,
        onPressIn: onPressIn as (e?: OnKeyPress) => void,
        onPressOut: onPressOut as (e?: OnKeyPress) => void,
        triggerCodes,
        androidKeyboardPressState,
      });

      const renderedChildren = useRenderedChildren({
        focused,
        keyboardPressed,
        renderContent: renderContent as unknown as (
          state: Record<string, unknown>
        ) => React.ReactNode,
        renderFocusable,
      });

      const childContent = useMemo(() => {
        if (renderedChildren !== undefined) return renderedChildren;
        if (keyboardPressed && typeof userChildren === 'function') {
          const childrenFn = userChildren as (
            state: Record<string, unknown>
          ) => React.ReactNode;
          return (state: Record<string, unknown>) =>
            childrenFn({ ...state, pressed: true });
        }
        return userChildren;
      }, [renderedChildren, userChildren, keyboardPressed]);

      const containerStyleArr = useMemo(
        () => [containerStyle as ViewProps['style'], containerFocusedStyle],
        [containerStyle, containerFocusedStyle]
      );

      return (
        <IsViewFocusedContext.Provider value={focused}>
          <A11yView
            style={containerStyleArr}
            defaultFocusHighlightEnabled={defaultFocusHighlightEnabled}
            ref={ref as RefObject<BaseKeyboardViewType | View>}
            onKeyUpPress={onKeyUpPressHandler}
            onKeyDownPress={onKeyDownPressHandler}
            onFocus={onFocus ?? undefined}
            onBlur={onBlur ?? undefined}
            onFocusChange={onFocusChangeHandler}
            onContextMenuPress={onContextMenuHandler}
            enableContextMenu={enableContextMenu}
            haloEffect={haloEffect}
            tintType={tintType}
            haloCornerRadius={haloCornerRadius}
            haloExpendX={haloExpendX}
            haloExpendY={haloExpendY}
            autoFocus={autoFocus}
            focusable={focusable}
            tintColor={tintColor}
            focusableWrapper={focusableWrapper}
            groupIdentifier={groupIdentifier}
            screenAutoA11yFocus={screenAutoA11yFocus}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
            lockFocus={lockFocus}
            roundedHaloFix={roundedHaloFix}
            optimistic={optimistic}
            orderIndex={orderIndex}
            orderGroup={orderGroup}
            orderId={orderId}
            orderLeft={orderLeft}
            orderRight={orderRight}
            orderUp={orderUp}
            orderDown={orderDown}
            orderForward={orderForward}
            orderBackward={orderBackward}
            orderFirst={orderFirst}
            orderLast={orderLast}
          >
            <Component
              ref={componentRef}
              style={componentStyleViewStyle}
              onPress={
                onPressHandler as KeyboardPressType<ComponentProps>['onPress']
              }
              onLongPress={
                onLongPress as KeyboardPressType<ComponentProps>['onLongPress']
              }
              onPressIn={
                onPressIn as KeyboardPressType<ComponentProps>['onPressIn']
              }
              onPressOut={
                onPressOut as KeyboardPressType<ComponentProps>['onPressOut']
              }
              onFocus={onComponentFocus}
              onBlur={onComponentBlur}
              focusable={focusable}
              {...(props as unknown as ComponentProps)}
              {...(childContent !== undefined &&
                ({
                  children: childContent,
                } as unknown as Partial<ComponentProps>))}
            />
          </A11yView>
        </IsViewFocusedContext.Provider>
      );
    })
  );

  const wrappedComponentName =
    (Component as any)?.displayName || (Component as any).name || 'Component';
  WithKeyboardFocus.displayName = `withKeyboardFocus(${wrappedComponentName})`;

  return WithKeyboardFocus;
};
