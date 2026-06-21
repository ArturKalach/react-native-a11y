import React, {
  type ComponentType,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Platform, type View } from 'react-native';
import A11yViewNative, {
  Commands,
} from '../../nativeSpecs/RCA11yViewNativeComponent';
import type { KeyboardFocus } from '../../types';
import { KeyPressContext } from '../../context/BubbledKeyPressContext';
import { useGroupIdentifierContext } from '../../context/GroupIdentifierContext';
import { useOrderFocusGroup } from '../../context/OrderFocusContext';
import { useOnFocusChange } from '../../utils/useOnFocusChange';
import { useWrappedOrderProps } from '../../utils/useWrappedOrderProps';
import { useOrderValidation } from '../../utils/useOrderValidation';
import { mapLockFocus } from '../../utils/mapLockFocus';
import {
  useBubbledInfo,
  useScreenReaderProps,
  useSequenceOrderKey,
  resolveFocusTarget,
  resolveOptimisticProps,
} from './A11yView.hooks';
import {
  type A11yViewProps,
  A11yContainerTypeEnum,
  ORDER_TYPE_VALUE,
} from './A11yView.types';

// @ts-ignore — codegen command ref type is intentionally generic
type NativeRef = React.ElementRef<ComponentType>;
const isIOS = Platform.OS === 'ios';

/**
 * Unified accessibility view backing the native `A11yView` — the merge of
 * react-native-external-keyboard's `BaseKeyboardView` (physical-keyboard focus,
 * key events, halo, focus order) and react-native-a11y-order's `A11yIndex`
 * (screen-reader order/focus). Every capability is opt-in: with no a11y props it
 * behaves like a plain `View`.
 *
 * Also backs `A11y.Index` — a positional `index` (or being inside `A11y.Order`)
 * wires the screen-reader sequence key from context.
 */
export const A11yView = React.memo(
  React.forwardRef<KeyboardFocus | View, A11yViewProps>(
    (
      {
        // Keyboard focus / events
        onFocusChange,
        onKeyUpPress,
        onKeyDownPress,
        onContextMenuPress,
        onBubbledContextMenuPress,
        onFocus,
        onBlur,
        haloEffect,
        autoFocus,
        focusable = true,
        focusableWrapper,
        groupIdentifier,
        tintColor,
        tintType,
        screenAutoA11yFocus,
        screenAutoA11yFocusDelay = 300,
        lockFocus,
        enableContextMenu,
        haloCornerRadius,
        haloExpendX,
        haloExpendY,
        roundedHaloFix = false,
        defaultFocusHighlightEnabled = true,
        enableA11yFocus: _enableA11yFocus,
        // Order (shared + links)
        orderType,
        screenReaderFocusTarget,
        index,
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
        orderPrefix: _orderPrefix,
        // Screen reader
        a11yUIContainer,
        shouldGroupAccessibilityChildren,
        optimistic,
        onScreenReaderFocused,
        onScreenReaderSubViewFocusChange,
        onScreenReaderSubViewFocused,
        onScreenReaderSubViewBlurred,
        onScreenReaderDescendantFocusChanged,
        importantForAccessibility: importantForAccessibilityProp,
        ...props
      },
      ref
    ) => {
      const targetRef = useRef<View | null>(null);

      const contextIdentifier = useGroupIdentifierContext();
      const contextGroupId = useOrderFocusGroup();
      const groupId = orderGroup ?? contextGroupId;
      const orderPrefix = _orderPrefix ?? contextGroupId ?? '';

      const resolvedIndex = index ?? orderIndex;
      const { orderKey, hasOrderInfo } = useSequenceOrderKey(index);

      useOrderValidation({
        groupId,
        orderIndex: resolvedIndex,
        orderPrefix,
        orderId,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
      });

      useImperativeHandle(
        ref,
        () => {
          const nativeCommands: Record<string, () => void> = {
            keyboardFocus: () => {
              if (targetRef.current) {
                Commands.keyboardFocus(
                  targetRef.current as unknown as NativeRef
                );
              }
            },
            screenReaderFocus: () => {
              if (targetRef.current) {
                Commands.screenReaderFocus(
                  targetRef.current as unknown as NativeRef
                );
              }
            },
            focus: () => {
              if (targetRef.current) {
                Commands.focus(targetRef.current as unknown as NativeRef);
              }
            },
          };

          return new Proxy({} as KeyboardFocus | View, {
            get(_t, prop: string) {
              if (prop in nativeCommands) return nativeCommands[prop];
              return (
                targetRef.current as unknown as
                  | Record<string, unknown>
                  | null
                  | undefined
              )?.[prop];
            },
          });
        },
        [targetRef]
      );

      const bubbled = useBubbledInfo(onBubbledContextMenuPress);

      const onFocusChangeHandler = useOnFocusChange({
        onFocusChange,
        onFocus,
        onBlur,
      });
      const hasFocusListener = Boolean(onFocusChange || onFocus || onBlur);

      const screenReaderNativeProps = useScreenReaderProps({
        onScreenReaderFocused,
        onScreenReaderSubViewFocusChange,
        onScreenReaderSubViewFocused,
        onScreenReaderSubViewBlurred,
        onScreenReaderDescendantFocusChanged,
      });

      const wrappedOrderProps = useWrappedOrderProps({
        orderPrefix,
        orderId,
        orderForward,
        orderBackward,
        orderFirst,
        orderLast,
        orderLeft,
        orderRight,
        orderUp,
        orderDown,
      });

      const lockFocusValue = useMemo(
        () => mapLockFocus(lockFocus),
        [lockFocus]
      );

      const containerTypeValue = a11yUIContainer
        ? A11yContainerTypeEnum[a11yUIContainer]
        : undefined;

      const shouldGroupChildrenValue =
        shouldGroupAccessibilityChildren === undefined
          ? -1
          : shouldGroupAccessibilityChildren
          ? 1
          : 0;

      const focusTargetValue = resolveFocusTarget(
        screenReaderFocusTarget,
        focusableWrapper
      );

      const optimisticProps = useMemo(
        () => (isIOS ? resolveOptimisticProps(optimistic) : undefined),
        [optimistic]
      );

      // When this view sits inside an `A11y.Order` and is itself the focus
      // target (`self`/unset ⇒ ORDER_FOCUS_TYPE_DEFAULT), it must be promoted to
      // an accessibility node — otherwise the native `setAccessibilityTraversalBefore`
      // links land on a non-accessible wrapper and TalkBack ignores the order.
      // Mirrors react-native-a11y-order's `A11yIndex`.
      const isSelfFocusTarget =
        focusTargetValue === undefined || focusTargetValue === 0;
      const importantForAccessibility =
        hasOrderInfo && isSelfFocusTarget
          ? 'yes'
          : importantForAccessibilityProp;

      const platformSpecificHalo =
        tintType !== 'none' &&
        (isIOS ? haloEffect ?? true : defaultFocusHighlightEnabled);

      return (
        <KeyPressContext.Provider value={bubbled.context}>
          <A11yViewNative
            {...props}
            ref={targetRef as React.RefObject<any>}
            // Keyboard
            canBeFocused={focusable}
            autoFocus={autoFocus}
            haloEffect={platformSpecificHalo}
            haloCornerRadius={haloCornerRadius}
            haloExpendX={haloExpendX}
            haloExpendY={haloExpendY}
            roundedHaloFix={roundedHaloFix}
            tintColor={isIOS ? tintColor : undefined}
            groupIdentifier={groupIdentifier ?? contextIdentifier}
            screenAutoA11yFocus={screenAutoA11yFocus}
            screenAutoA11yFocusDelay={screenAutoA11yFocusDelay}
            enableContextMenu={enableContextMenu}
            onKeyDownPress={onKeyDownPress}
            onKeyUpPress={onKeyUpPress}
            onContextMenuPress={onContextMenuPress}
            onBubbledContextMenuPress={bubbled.contextMenu}
            onFocusChange={hasFocusListener ? onFocusChangeHandler : undefined}
            hasKeyDownPress={Boolean(onKeyDownPress)}
            hasKeyUpPress={Boolean(onKeyUpPress)}
            hasOnFocusChanged={hasFocusListener}
            lockFocus={lockFocusValue}
            // Order (shared + links)
            orderType={orderType ? ORDER_TYPE_VALUE[orderType] : undefined}
            orderIndex={resolvedIndex ?? -1}
            orderGroup={groupId}
            // Only forward the SR sequence key for an actual positional item. A
            // plain view inside a KeyboardOrderFocusGroup inherits the group's
            // orderKey from context but has no index; sending the key would make
            // it register (and collide) as an SR-ordered item. Native guards this
            // too (orderIndex < 0) — this is defense-in-depth.
            orderKey={resolvedIndex !== undefined ? orderKey : undefined}
            focusTarget={focusTargetValue}
            importantForAccessibility={importantForAccessibility}
            {...wrappedOrderProps}
            // Screen reader
            containerType={containerTypeValue}
            shouldGroupAccessibilityChildren={shouldGroupChildrenValue}
            {...optimisticProps}
            {...screenReaderNativeProps}
          />
        </KeyPressContext.Provider>
      );
    }
  )
);
