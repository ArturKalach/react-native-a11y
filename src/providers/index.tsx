import React from 'react';

/**
 * `A11yProvider` is a passthrough kept for backward compatibility with
 * `react-native-a11y@0.7`. The status hooks/listeners
 * (`useIsScreenReaderEnabled`, `useIsKeyboardConnected`, …) live in `../utils`.
 */
export const A11yProvider = ({ children }: React.PropsWithChildren) => (
  <>{children}</>
);
