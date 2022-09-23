import type { RefObject, MutableRefObject, ForwardedRef } from 'react';



export const combineRefs = <T>(
    ref: RefObject<T>,
    combinedRef?: ForwardedRef<T>,
  ): (ref: T | null) => void => (component) => {
        (ref as MutableRefObject<T | null>).current = component;
        if (!combinedRef) return;

        if (typeof combinedRef === 'function') {
            combinedRef(component);
          } else {
            combinedRef.current = component;
        }
}