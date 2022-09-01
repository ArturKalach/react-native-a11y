import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-a11y' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type A11yProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'A11yView';

export const A11yView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<A11yProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
