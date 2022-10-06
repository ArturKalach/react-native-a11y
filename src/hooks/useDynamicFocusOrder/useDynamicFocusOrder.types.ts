import type { RefObject, RefCallback } from "react";
import type { View } from "react-native";

export type UseDynamicFocusOrder<T> = {
  a11yOrder: {
    ref: RefObject<View>;
    onLayout: () => void;
  };
  registerOrder: (order: number) => RefCallback<T>;
  reset: () => void;
  setOrder: () => void;
};
