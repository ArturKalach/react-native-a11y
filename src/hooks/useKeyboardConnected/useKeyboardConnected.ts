import { useEffect, useState } from "react";
import { A11yModule } from "../../modules";

export const useKeyboardConnected = () => {
  const [state, setState] = useState(false);
  useEffect(() => {
    A11yModule.isKeyboardConnected().then(setState);
    return A11yModule.keyboardStatusListener(
      ({ status }: { status: boolean }) => setState(status),
    );
  }, []);

  return state;
};
