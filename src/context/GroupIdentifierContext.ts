import React, { useContext } from 'react';

/** iOS `focusGroupIdentifier` propagated to descendant focusable views. */
export const GroupIdentifierContext = React.createContext<string | undefined>(
  undefined
);

export const useGroupIdentifierContext = () =>
  useContext(GroupIdentifierContext);
