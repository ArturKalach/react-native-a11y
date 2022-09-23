/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import type { A11yOrderProps } from './A11yOrder.types';

export const A11yOrder: React.FC<A11yOrderProps> = ({
  a11yOrder,
  onLayout,
  ...props
}) => {
  const onLayoutHandler = (e: LayoutChangeEvent) => {
    onLayout?.(e)
    a11yOrder.onLayout()
  }
  return <View {...props} onLayout={onLayoutHandler} ref={a11yOrder.ref} />;
};
