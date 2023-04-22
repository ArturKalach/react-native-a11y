import React, { useId } from "react";
import { View, LayoutChangeEvent } from "react-native";
import type { A11yOrderProps } from "./A11yOrder.types";

export const A11yOrder: React.FC<A11yOrderProps> = ({
  a11yOrder,
  onLayout,
  ...props
}) => {
  const onLayoutHandler = (e: LayoutChangeEvent) => {
    onLayout?.(e);
    a11yOrder.onLayout();
  };

  const id = useId?.() || "mock_id"; // ToDo: use native component with tag to nativeTag

  return (
    <View
      nativeID={id}
      {...props}
      onLayout={onLayoutHandler}
      ref={a11yOrder.ref}
    />
  );
};
