import { requireNativeComponent } from 'react-native';
import type { FocusWrapperProps } from './RCA11yFocusWrapper.types';

const ComponentName = 'RCA11yFocusWrapper';

export const NativeFocusWrapper = requireNativeComponent<FocusWrapperProps>(ComponentName)
