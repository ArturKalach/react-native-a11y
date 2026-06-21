import React from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import type { A11yOrderProps } from './A11yOrder.types';

/**
 * Legacy 0.7 hook-companion container. Wraps the ordered children, forwarding
 * the `a11yOrder.ref` (used to resolve the container's native tag) and chaining
 * `a11yOrder.onLayout` so the order is (re)applied on layout. The order itself
 * is resolved imperatively via `findNodeHandle` — no `nativeID` needed.
 *
 * Distinct from the declarative `A11y.Order` (orderKey/context based).
 */
export const A11yOrder: React.FC<A11yOrderProps> = ({
  a11yOrder,
  onLayout,
  ...props
}) => {
  const onLayoutHandler = (e: LayoutChangeEvent) => {
    onLayout?.(e);
    a11yOrder.onLayout();
  };

  return (
    <View
      collapsable={false}
      {...props}
      onLayout={onLayoutHandler}
      ref={a11yOrder.ref}
    />
  );
};
