import {
  Pressable as RNPressable,
  type PressableProps,
  type ViewProps,
  type View,
} from 'react-native';

import { withKeyboardFocus } from '../../utils/withKeyboardFocus';
import type { WithKeyboardFocusPropsWithRef } from '../../types';

/** Pressable with unified keyboard + a11y focus. */
export const A11yPressable = withKeyboardFocus(RNPressable);

export type A11yPressableProps = WithKeyboardFocusPropsWithRef<
  PressableProps,
  ViewProps['style'],
  View
>;
