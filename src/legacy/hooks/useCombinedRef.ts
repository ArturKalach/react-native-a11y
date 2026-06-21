import {
  useMemo,
  useRef,
  type Ref,
  type RefObject,
  type RefCallback,
} from 'react';
import { combineRefs } from '../../utils';

/**
 * Legacy 0.7 helper — returns a stable target `RefObject` plus a callback ref
 * that fans out to the target and any extra refs. Reimplemented on the unified
 * {@link combineRefs} util.
 */
export const useCombinedRef = <T>(
  ...refs: Ref<T>[]
): [ref: RefObject<T>, initRefCallback: RefCallback<T>] => {
  const targetRef = useRef<T>(null);
  const refCallback = useMemo(() => {
    return combineRefs(targetRef, ...refs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [targetRef, refCallback];
};
