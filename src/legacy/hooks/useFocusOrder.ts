import { useRef } from 'react';

import { useDynamicFocusOrder } from './useDynamicFocusOrder';
import type { FocusOrderInfo } from './useFocusOrder.types';

/**
 * Legacy 0.7 imperative order hook for a fixed number (`size`) of children.
 * Returns a stable `refs` array — attach `refs[i]` to each child and spread
 * `a11yOrder` onto the wrapping `Legacy.A11yOrder`.
 */
export const useFocusOrder = <T>(size: number): FocusOrderInfo<T> => {
  const { a11yOrder, registerOrder, reset, setOrder } =
    useDynamicFocusOrder<T>();

  const refs = useRef(
    Array(size)
      .fill(null)
      .map((_, i) => registerOrder(i))
  ).current;

  return {
    a11yOrder,
    refs,
    reset,
    setOrder,
  };
};
