import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

type PushMode = { enabled: boolean; setEnabled: (value: boolean) => void };

const PushModeContext = createContext<PushMode>({
  enabled: false,
  setEnabled: () => {},
});

/** Whether the recursive-push footer button is active across all screens. */
export const usePushMode = () => useContext(PushModeContext);

export const PushModeProvider = ({ children }: PropsWithChildren) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <PushModeContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </PushModeContext.Provider>
  );
};
