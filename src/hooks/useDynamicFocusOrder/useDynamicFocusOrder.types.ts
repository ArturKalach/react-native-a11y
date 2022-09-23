import type { RefObject } from "react";
import type { View } from "react-native";

export type UseDynamicFocusOrder = () => {
  a11yOrder: {
    ref: RefObject<View>;
    onLayout: () => void;
  };
  registerOrder: (order: number) => (ref: View) => void;
  reset: () => void;
};
