import { Platform } from 'react-native';

// Android-only focus borders for the keyboard focus-order examples. On iOS the
// system focus halo handles the indicator, so these resolve to `undefined`.
// Ported from react-native-external-keyboard's example constants.
export const ANDROID_FOCUS_STYLE = Platform.select({
  android: { borderWidth: 2, borderColor: '#007AFF', borderRadius: 12 },
});

export const ANDROID_SECONDARY_FOCUS_STYLE = Platform.select({
  android: { borderWidth: 2, borderColor: '#000000', borderRadius: 12 },
});
