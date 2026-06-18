import type { RefCallback } from 'react';
import type { UseDynamicFocusOrder } from './useDynamicFocusOrder.types';

export type FocusOrderInfo<T> = Pick<
  UseDynamicFocusOrder<T>,
  'a11yOrder' | 'reset' | 'setOrder'
> & {
  refs: RefCallback<T>[];
};
