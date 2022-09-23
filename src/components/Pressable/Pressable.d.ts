import { View, ViewProps, PressableProps } from 'react-native';

import { KeyboardFocusViewProps } from './RCA11yFocusWrapper';

declare const Pressable: React.ForwardRefExoticComponent<
  PressableProps & KeyboardFocusViewProps & React.RefAttributes<View>
>;
