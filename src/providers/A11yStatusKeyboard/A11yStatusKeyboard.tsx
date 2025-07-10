import React, { type PropsWithChildren, useContext } from 'react';
import { useKeyboardConnected } from '../../hooks';

const A11yKeyboardContext = React.createContext<boolean>(false);

export const useKeyboardStatus = () => useContext(A11yKeyboardContext);

//ToDo get rid of unnecessary provider
export const A11yStatusKeyboard: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const status = useKeyboardConnected();

  return (
    <A11yKeyboardContext.Provider value={status}>
      {children}
    </A11yKeyboardContext.Provider>
  );
};
