import React, { useContext } from 'react';
import { useKeyboardConnected } from "../../hooks";

const A11yKeyboardContext = React.createContext<boolean>(false);

export const useKeyboardStatus = () => useContext(A11yKeyboardContext);

export const A11yStatusKeyboard: React.FC = ({ children }) => {
    const status = useKeyboardConnected();
    
    return <A11yKeyboardContext.Provider value={status}>
      {children}
    </A11yKeyboardContext.Provider>
}
