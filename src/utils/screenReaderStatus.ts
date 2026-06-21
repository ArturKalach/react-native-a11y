import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { StatusCallback } from '../modules/KeyboardConnected';

/**
 * Screen-reader (VoiceOver / TalkBack) status, parallel to the keyboard-status
 * API. Backed by RN's `AccessibilityInfo` — no native module needed. The
 * listener payload mirrors `keyboardStatusListener` (`{ status: boolean }`).
 */

/** Resolves whether a screen reader is currently enabled. */
export const isScreenReaderEnabled = (): Promise<boolean> =>
  AccessibilityInfo.isScreenReaderEnabled();

/**
 * Subscribes to screen-reader enable/disable changes.
 * Returns a function that removes the listener.
 */
export const screenReaderStatusListener = (callback: StatusCallback) => {
  const subscription = AccessibilityInfo.addEventListener(
    'screenReaderChanged',
    (status) => callback({ status })
  );
  return () => subscription.remove();
};

/**
 * Whether a screen reader is currently enabled. Queries the current state on
 * mount and updates live via the `screenReaderChanged` event.
 */
export const useIsScreenReaderEnabled = (): boolean => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    isScreenReaderEnabled().then((value) => {
      if (mounted) setEnabled(value);
    });
    const removeListener = screenReaderStatusListener((e) =>
      setEnabled(e.status)
    );
    return () => {
      mounted = false;
      removeListener();
    };
  }, []);

  return enabled;
};

/**
 * Ref variant of {@link useIsScreenReaderEnabled} — returns a ref whose
 * `.current` always holds the latest enabled state, without re-rendering on
 * change. Read `ref.current` inside callbacks/effects where a live value is
 * needed.
 */
export const useIsScreenReaderEnabledRef = (): MutableRefObject<boolean> => {
  const ref = useRef(false);

  useEffect(() => {
    let mounted = true;
    isScreenReaderEnabled().then((value) => {
      if (mounted) ref.current = value;
    });
    const removeListener = screenReaderStatusListener((e) => {
      ref.current = e.status;
    });
    return () => {
      mounted = false;
      removeListener();
    };
  }, []);

  return ref;
};
