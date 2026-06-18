import React from 'react';
import type { ViewProps } from 'react-native';
import { A11ySequenceOrderContext } from '../../context/A11ySequenceOrderContext';
import A11yOrderNative from '../../nativeSpecs/A11yOrderNativeComponent';

/** Props for `A11y.Order` — a screen-reader focus-sequence container. */
export type A11yOrderProps = ViewProps;

/**
 * Declarative screen-reader order container. Generates an `orderKey` and provides
 * it via context to descendant `A11y.Index` elements.
 */
export const A11yOrder = React.memo<A11yOrderProps>((props) => {
  const orderKey = React.useId();
  return (
    <A11ySequenceOrderContext.Provider value={orderKey}>
      <A11yOrderNative {...props} orderKey={orderKey} />
    </A11ySequenceOrderContext.Provider>
  );
});
