import type { NativeSyntheticEvent } from 'react-native';

export type KeyboardFocusEvent = NativeSyntheticEvent<
  Readonly<{ isFocused: boolean }>
>;
export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;
