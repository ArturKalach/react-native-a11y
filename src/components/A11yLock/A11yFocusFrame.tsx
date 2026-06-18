import { View } from 'react-native';
import { FrameProvider } from '../../context/FocusFrameProviderContext';
import type { A11yFocusFrameProps } from './A11yLock.types';

/** iOS/default: a frame is a focus-lock provider boundary around a plain View. */
export const A11yFocusFrame = (props: A11yFocusFrameProps) => (
  <FrameProvider>
    <View {...props} />
  </FrameProvider>
);
