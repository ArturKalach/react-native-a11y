import type { Ref } from 'react';

/** Merges multiple refs into one callback ref. */
export function combineRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: T | null }).current = node;
      }
    });
  };
}
