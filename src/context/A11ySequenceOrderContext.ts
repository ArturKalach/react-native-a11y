import React from 'react';

/**
 * Links `A11y.Index` children to their enclosing `A11y.Order` via a generated
 * `orderKey`. Consumed by the declarative screen-reader order system.
 */
export const A11ySequenceOrderContext = React.createContext<string | undefined>(
  undefined
);
