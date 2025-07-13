import {
  type DrawerHeaderProps,
  useDrawerStatus,
} from '@react-navigation/drawer';
import { getHeaderTitle, Header as Head } from '@react-navigation/elements';
import { KeyboardProvider } from 'react-native-a11y';
import { DrawerToggle } from './DrawerToggle';

export const Header = ({ navigation, route, options }: DrawerHeaderProps) => {
  const title = getHeaderTitle(options, route.name);
  const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <KeyboardProvider value={!isDrawerOpen}>
      <Head
        headerLeft={() => <DrawerToggle navigation={navigation} />}
        title={title}
      />
    </KeyboardProvider>
  );
};
