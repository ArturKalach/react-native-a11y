import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import {
  isKeyboardConnected,
  keyboardStatusListener,
} from '../modules/KeyboardConnected';

const GC_FRAMEWORK_LINKING_ERROR = 'GC_FRAMEWORK_LINKING_ERROR';

/**
 * Whether a physical keyboard is currently connected. Queries the current state
 * on mount and updates live via the `keyboardStatus` event.
 *
 * @param ignoreWarn suppress the console error when the iOS GameController
 *   framework isn't linked.
 */
export const useIsKeyboardConnected = (ignoreWarn = false): boolean => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const removeListener = keyboardStatusListener((e) =>
      setIsConnected(e.status)
    );
    isKeyboardConnected()
      .then(setIsConnected)
      .catch((e) => {
        if (!ignoreWarn && e?.code === GC_FRAMEWORK_LINKING_ERROR) {
          console.error(e.message);
        }
      });

    return removeListener;
  }, [ignoreWarn]);

  return isConnected;
};

/**
 * Ref variant of {@link useIsKeyboardConnected} — returns a ref whose `.current`
 * always holds the latest connection state, without re-rendering on change. Read
 * `ref.current` inside callbacks/effects where a live value is needed.
 *
 * @param ignoreWarn suppress the console error when the iOS GameController
 *   framework isn't linked.
 */
export const useIsKeyboardConnectedRef = (
  ignoreWarn = false
): MutableRefObject<boolean> => {
  const ref = useRef(false);

  useEffect(() => {
    const removeListener = keyboardStatusListener((e) => {
      ref.current = e.status;
    });
    isKeyboardConnected()
      .then((status) => {
        ref.current = status;
      })
      .catch((e) => {
        if (!ignoreWarn && e?.code === GC_FRAMEWORK_LINKING_ERROR) {
          console.error(e.message);
        }
      });

    return removeListener;
  }, [ignoreWarn]);

  return ref;
};
