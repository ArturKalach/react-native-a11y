import {
  type DrawerHeaderProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { getHeaderTitle, Header as Head } from '@react-navigation/elements';
import { KeyboardProvider } from 'react-native-a11y';
import { DrawerToggle } from './DrawerToggle';
import { useCallback } from 'react';

export const Header = ({ navigation, route, options }: DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const isDrawerOpen = useDrawerStatus() === 'open';

  const leftHeader = useCallback(
    () => <DrawerToggle navigation={navigation} />,
    [navigation]
  );
  return (
    <KeyboardProvider value={!isDrawerOpen}>
      <Head headerLeft={leftHeader} title={title} />
    </KeyboardProvider>
  );
};
