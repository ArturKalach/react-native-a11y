import React, { useContext } from 'react';

/** Tracks whether a context-menu (long-press) handler bubbles from an ancestor. */
export const KeyPressContext = React.createContext<{
  bubbledMenu: boolean;
}>({
  bubbledMenu: false,
});

export const useKeyPressContext = () => useContext(KeyPressContext);
