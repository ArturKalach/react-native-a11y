import type { NativeSyntheticEvent } from 'react-native';
import type { KeyPress } from '../nativeSpecs/RCA11yViewNativeComponent';

/** Native event payload for a physical key press (key down / key up). */
export type OnKeyPress = NativeSyntheticEvent<KeyPress>;

/** Handler receiving a physical {@link OnKeyPress} event. */
export type OnKeyPressFn = (e: OnKeyPress) => void;
