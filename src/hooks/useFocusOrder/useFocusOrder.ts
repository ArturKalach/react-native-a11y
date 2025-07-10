import { useRef } from 'react';

import { useDynamicFocusOrder } from '../useDynamicFocusOrder';
import type { FocusOrderInfo } from './useFocusOrder.types';

export const useFocusOrder = <T>(size: number): FocusOrderInfo<T> => {
  const { a11yOrder, registerOrder, reset, setOrder } = useDynamicFocusOrder();

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
