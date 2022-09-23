import { RefObject, MutableRefObject, ForwardedRef } from "react";

type ReturnCombineRef<T> = (ref: T | null) => void;

export const combineRefs =
  <T>(ref: RefObject<T>, combinedRef?: ForwardedRef<T>): ReturnCombineRef<T> =>
  component => {
    (ref as MutableRefObject<T | null>).current = component;
    if (!combinedRef) return;

    if (typeof combinedRef === "function") {
      combinedRef(component);
    } else {
      combinedRef.current = component;
    }
  };
