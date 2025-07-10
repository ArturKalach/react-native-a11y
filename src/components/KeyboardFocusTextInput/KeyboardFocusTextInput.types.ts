import type { NativeSyntheticEvent } from 'react-native';

export type KeyboardFocusEvent = NativeSyntheticEvent<{
  isFocused: boolean;
}>;
export type OnFocusChangeFn = (e: KeyboardFocusEvent) => void;
