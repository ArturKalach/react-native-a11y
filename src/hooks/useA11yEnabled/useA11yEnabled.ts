import { useEffect, useState } from 'react';
import { A11yModule } from 'react-native-a11y';

export const useA11yEnabled = () => {
    const [state, setState] = useState(false);
    useEffect(() => {
      A11yModule.isA11yReaderEnabled().then(setState);

      return A11yModule.a11yStatusListener(({ status }: { status: boolean }) =>
        setState(status),
      );
    }, []);
  
    return state;
};
