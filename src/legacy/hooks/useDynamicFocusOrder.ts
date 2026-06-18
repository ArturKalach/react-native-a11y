import { useRef, useLayoutEffect } from 'react';
import type { View } from 'react-native';

import { useA11yOrderManager } from './useA11yOrderManager';
import type { UseDynamicFocusOrder } from './useDynamicFocusOrder.types';

/**
 * Legacy 0.7 imperative order hook for a dynamic number of children. Attach
 * `registerOrder(i)` as a ref to each child and spread `a11yOrder` onto the
 * wrapping `Legacy.A11yOrder`.
 */
export const useDynamicFocusOrder = <T>(): UseDynamicFocusOrder<T> => {
  const a11yOrderRef = useRef<View>(null);

  const {
    registerOrderRef: registerOrder,
    updateRefList,
    reset,
    setOrder,
  } = useA11yOrderManager<T>(a11yOrderRef);

  useLayoutEffect(updateRefList);

  return {
    a11yOrder: {
      ref: a11yOrderRef,
      onLayout: updateRefList,
    },
    registerOrder,
    reset,
    setOrder,
  };
};
