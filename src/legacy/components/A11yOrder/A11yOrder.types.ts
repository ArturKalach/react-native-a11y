import type { ViewProps, View } from 'react-native';
import type { RefObject } from 'react';

export type A11yOrderProps = {
  a11yOrder: {
    ref: RefObject<View>;
    onLayout: () => void;
  };
} & ViewProps;
