import { useEffect, useState } from 'react';
import { A11yModule } from 'react-native-a11y';

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