import type { ViewProps, View } from 'react-native';

export type A11yOrderProps = {
  a11yOrder: {
    ref: React.RefObject<View>;
    onLayout: () => void;
  };
} & ViewProps;
