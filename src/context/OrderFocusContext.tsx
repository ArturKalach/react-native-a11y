import React, { useContext, useId } from 'react';
import { Platform, type ViewProps } from 'react-native';
import { A11ySequenceOrderContext } from './A11ySequenceOrderContext';
import A11yOrderNative from '../nativeSpecs/RCA11yOrderNativeComponent';

/** Group id for keyboard index-based focus order (`orderGroup`). */
export const OrderFocusGroupContext = React.createContext<string | undefined>(
  undefined
);

export const useOrderFocusGroup = () => useContext(OrderFocusGroupContext);

type KeyboardOrderFocusGroupProps = {
  groupId?: string;
  children?: React.ReactNode;
  /** iOS only — style for the screen-reader order container (see below). */
  style?: ViewProps['style'];
};

const isIOS = Platform.OS === 'ios';

/**
 * Scopes index-based keyboard focus order to a generated (or explicit) group id.
 *
 * On **Android**, `orderIndex` wires both `nextFocusForward` (keyboard) and
 * `accessibilityTraversalBefore` (TalkBack) per-view, so this only needs to provide
 * the group id via context.
 *
 * On **iOS**, hardware-keyboard focus (UIFocus) is a separate system from VoiceOver,
 * which is ordered only by a container's `accessibilityElements`. To make `orderIndex`
 * drive VoiceOver too (matching Android), we render the screen-reader order container
 * (`A11yOrder`) keyed by the group id and expose that id as the SR sequence key — so
 * index-ordered descendants register under it and VoiceOver follows the same order.
 * A nested `A11y.Order` overrides the sequence key, so its items register with it and
 * this outer container stays empty (harmless: an empty relationship sets
 * `accessibilityElements = nil`, i.e. passthrough — see RCA11yRelationship).
 */
export const KeyboardOrderFocusGroup = ({
  children,
  groupId,
  style,
}: KeyboardOrderFocusGroupProps) => {
  const id = useId();
  const value = groupId ?? id;

  if (isIOS) {
    return (
      <OrderFocusGroupContext.Provider value={value}>
        <A11ySequenceOrderContext.Provider value={value}>
          <A11yOrderNative orderKey={value} style={style}>
            {children}
          </A11yOrderNative>
        </A11ySequenceOrderContext.Provider>
      </OrderFocusGroupContext.Provider>
    );
  }

  return <OrderFocusGroupContext.Provider value={value} children={children} />;
};
