import {
  useMemo,
  type Ref,
  type RefObject,
  type RefCallback,
  useRef,
} from 'react';
import { combineRefs } from '../../utils';

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
