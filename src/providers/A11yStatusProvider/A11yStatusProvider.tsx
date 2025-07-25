import React, { type PropsWithChildren, useContext } from 'react';
import { useA11yEnabled } from '../../hooks';

const A11yStatusContext = React.createContext<boolean>(false);

export const useA11yStatus = () => useContext(A11yStatusContext);

export const A11yStatusProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const status = useA11yEnabled();

  return (
    <A11yStatusContext.Provider value={status}>
      {children}
    </A11yStatusContext.Provider>
  );
};
