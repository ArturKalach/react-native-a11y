import React, { useContext } from "react";

type Props = { value?: boolean };

const KeyboardContext = React.createContext<boolean>(false);

export const useCanBeFocused = () => useContext(KeyboardContext);

export const KeyboardProvider: React.FC<Props> = ({
  children,
  value = true,
}) => {
  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};
