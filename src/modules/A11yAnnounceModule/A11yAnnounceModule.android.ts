// Android — bypasses the native bridge, uses the built-in RN API directly.
// Mirrors the value exports of A11yAnnounceModule.ts; types come from there at
// type-check time (this variant is selected only at runtime on Android).
import { AccessibilityInfo } from 'react-native';

export const announce = (message: string) => {
  AccessibilityInfo.announceForAccessibility(message);
  return Promise.resolve({ id: '', status: 'fired' as const });
};

export const cancel = () =>
  Promise.resolve({ id: '', status: 'cancelled' as const });

export const cancelAll = () =>
  Promise.resolve({ id: '', status: 'cancelled' as const });

export const ScreenReader = {
  announce: (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
    return Promise.resolve({ id: '', status: 'fired' as const });
  },
  cancel,
  cancelAll,
};
