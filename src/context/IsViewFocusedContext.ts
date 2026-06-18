import React, { useContext } from 'react';

/** Whether the nearest focusable view is currently keyboard-focused. */
export const IsViewFocusedContext = React.createContext<boolean>(false);

export const useIsViewFocused = () => useContext(IsViewFocusedContext);
