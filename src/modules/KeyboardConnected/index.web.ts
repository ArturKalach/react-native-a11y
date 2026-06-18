/** Web fallback — no physical-keyboard detection; reports "not connected". */

export type StatusCallback = (e: { status: boolean }) => void;

export const isKeyboardConnected = (): Promise<boolean> =>
  Promise.resolve(false);

export const keyboardStatusListener = (_callback: StatusCallback) => () => {};
