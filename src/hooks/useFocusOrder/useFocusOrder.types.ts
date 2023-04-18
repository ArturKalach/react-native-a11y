import { RefCallback } from "react";
import { UseDynamicFocusOrder } from "../useDynamicFocusOrder";

export type FocusOrderInfo<T> = Pick<
  UseDynamicFocusOrder<T>,
  "a11yOrder" | "reset" | "setOrder"
> & {
  refs: RefCallback<T>[];
};
