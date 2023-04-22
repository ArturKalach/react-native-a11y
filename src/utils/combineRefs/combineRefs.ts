import { Ref, RefCallback } from "react";

export const combineRefs =
  <T>(...refs: Ref<T>[]): RefCallback<T> =>
  component =>
    refs.forEach(item => {
      if (typeof item === "function") {
        item(component);
      } else if (item !== null && item?.current !== undefined) {
        (item as React.MutableRefObject<T | null>).current = component;
      }
    });
