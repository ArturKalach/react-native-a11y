import { useEffect, useRef, useCallback } from 'react';
import type { View } from 'react-native';

import { A11yOrderManager } from '../../utils';
import type { UseDynamicFocusOrder } from './useDynamicFocusOrder.types';


export const useDynamicFocusOrder: UseDynamicFocusOrder = () => {
    const a11yOrderRef = useRef<View>(null);
    const managerRef = useRef(new A11yOrderManager(a11yOrderRef))
    const { 
        registerOrderRef: registerOrder,
        onViewShown: onLayout,
        updateRefList,
        reset: resetOrderManager 
    } = managerRef.current;
  
    useEffect(updateRefList);
  
    const reset = useCallback(() => {
        resetOrderManager();
        managerRef.current = new A11yOrderManager(a11yOrderRef)
      }, [])

    return { 
        a11yOrder: {
            ref: a11yOrderRef, 
            onLayout,
        },
        registerOrder,
        reset
    };
};