/**
 * `Legacy.*` — backward-compatibility surface for react-native-a11y@0.7's
 * **imperative** focus-order API. The modern, recommended path is the
 * declarative `A11y.Order` / `A11y.Index`; everything here exists only to ease
 * migration and is candidate for removal in a future major.
 *
 *   import { Legacy } from 'react-native-a11y';
 *   const { a11yOrder, refs } = Legacy.useFocusOrder(2);
 *   <Legacy.A11yOrder a11yOrder={a11yOrder}>…</Legacy.A11yOrder>
 */
import { A11yOrder } from './components/A11yOrder';
import { useCombinedRef } from './hooks/useCombinedRef';
import { useFocusOrder } from './hooks/useFocusOrder';
import { useDynamicFocusOrder } from './hooks/useDynamicFocusOrder';
import {
  setAccessibilityFocus,
  setKeyboardFocus,
  setPreferredKeyboardFocus,
} from './focus';
import { combineRefs } from '../utils';

export const Legacy = {
  A11yOrder,
  useCombinedRef,
  useFocusOrder,
  useDynamicFocusOrder,
  combineRefs,
  setAccessibilityFocus,
  setKeyboardFocus,
  setPreferredKeyboardFocus,
};

export type { A11yOrderProps } from './components/A11yOrder/A11yOrder.types';
export type { UseDynamicFocusOrder } from './hooks/useDynamicFocusOrder.types';
export type { FocusOrderInfo } from './hooks/useFocusOrder.types';
