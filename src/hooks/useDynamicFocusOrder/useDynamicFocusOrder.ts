import { useRef, useLayoutEffect } from "react";
import type { View } from "react-native";

import { useA11yOrderManager } from "../dev";
import type { UseDynamicFocusOrder } from "./useDynamicFocusOrder.types";

export const useDynamicFocusOrder = <T>(): UseDynamicFocusOrder<T> => {
  const a11yOrderRef = useRef<View>(null);

  const {
    registerOrderRef: registerOrder,
    updateRefList,
    reset,
    setOrder,
  } = useA11yOrderManager(a11yOrderRef);

  useLayoutEffect(updateRefList);

  return {
    a11yOrder: {
      ref: a11yOrderRef,
      onLayout: updateRefList,
    },
    registerOrder,
    reset,
    setOrder,
  };
};
