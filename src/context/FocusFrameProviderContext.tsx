import React, { useMemo } from 'react';
import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

/**
 * Shared focus-lock state for the unified `A11y.FocusTrap` / `A11y.FocusFrame`.
 *
 * The `-order` and `-external-keyboard` packages shipped an identical context
 * (`A11yFrameProvider` / `FrameProvider`); per the rework they are merged into
 * this single provider that backs both screen-reader and keyboard focus locking.
 */
type FocusFrameContextType = {
  hasFocusLock: boolean;
  setHasFocusLock: (v: boolean) => void;
  focusLockId: symbol | null;
  setFocusLockId: (v: symbol | null) => void;
};

const FocusFrameProviderContext = createContext<
  FocusFrameContextType | undefined
>(undefined);

export const useFocusFrameContext = () => useContext(FocusFrameProviderContext);

export const FrameProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasFocusLock, setHasFocusLock] = useState(false);
  const [focusLockId, setFocusLockId] = useState<symbol | null>(null);

  const state = useMemo(
    () => ({ hasFocusLock, focusLockId, setHasFocusLock, setFocusLockId }),
    [hasFocusLock, focusLockId]
  );

  return (
    <FocusFrameProviderContext.Provider value={state}>
      {children}
    </FocusFrameProviderContext.Provider>
  );
};
