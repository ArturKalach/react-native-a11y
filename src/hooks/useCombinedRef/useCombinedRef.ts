import { ForwardedRef, RefObject, useRef } from 'react';
import { combineRefs } from '../../utils';

export const useCombinedRef = <T>(ref: ForwardedRef<T>): [ref: RefObject<T>, setRefFunction: (ref: T|null) => void] => {
    const targetRef = useRef<T>(null);
    return [targetRef, combineRefs(targetRef, ref)];
}