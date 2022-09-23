import type { RefObject } from 'react';

export type FocusOrderInfo<T> = {
    a11yOrder: {
        ref: RefObject<T>;
        onLayout: () => void;
    }
    refs: ((ref: T | null) => void)[];
    reset: () => void;
};