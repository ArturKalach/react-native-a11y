import { useEffect, useRef, useCallback } from 'react';

import { A11yOrderManager } from '../../utils';
import type { FocusOrderInfo } from './useFocusOrder.types';

export const useFocusOrder = <T>(size: number): FocusOrderInfo<T> => {
    const a11yOrderRef = useRef<T>(null);
    const managerRef = useRef(new A11yOrderManager(a11yOrderRef))
    const { 
      onViewShown: onLayout,
      reset: resetOrderManager,
      registerOrderRef,
      updateRefList,
    } = managerRef.current;

    const reset = useCallback(() => {
      resetOrderManager();
      managerRef.current = new A11yOrderManager(a11yOrderRef)
    }, [])

    const refs = useRef(
      Array(size)
        .fill(null)
        .map((_, i) => registerOrderRef(i)),
    ).current;
  
    useEffect(updateRefList);
  
    return { 
      a11yOrder: {
        ref: a11yOrderRef,
        onLayout,
      },
      refs,
      reset
    };
  };