import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { A11yProvider } from 'react-native-a11y';
import {
  ReaderFocusScreen,
  HomeScreen,
  KeyboardFocusScreen,
  A11yOrderScreen,
  DynamicOrderScreen,
  ManagingRefsScreen,
  StatusScreen,
  TextInputFocus,
  KeyboardOnPressScreen,
} from './screens';
import * as Nav from './navigation';
import { DrawerContent, Header } from './components';

const Drawer = createDrawerNavigator<Nav.DrawerParamList>();

export const Root = () => {
  return (
    <A11yProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            header: (props) => <Header {...props} />,
          }}
          drawerContent={DrawerContent}
        >
          <Drawer.Screen
            options={{ title: 'About' }}
            name={Nav.ABOUT}
            component={HomeScreen}
          />
          <Drawer.Screen
            options={{ title: 'A11y Order' }}
            name={Nav.A11Y_ORDER}
            component={A11yOrderScreen}
          />
          <Drawer.Screen
            options={{ title: 'Reader focus' }}
            name={Nav.READER_FOCUS}
            component={ReaderFocusScreen}
          />
          <Drawer.Screen
            options={{ title: 'Keyboard focus' }}
            name={Nav.KEYBOARD_FOCUS}
            component={KeyboardFocusScreen}
          />
          <Drawer.Screen
            options={{ title: 'TextInput keyboard focus' }}
            name={Nav.TEXT_INPUT}
            component={TextInputFocus}
          />
          <Drawer.Screen
            options={{ title: 'Keyboard on press' }}
            name={Nav.KEYBOARD_ON_PRESS}
            component={KeyboardOnPressScreen}
          />
          <Drawer.Screen
            options={{ title: 'Status' }}
            name={Nav.STATUS_SCREEN}
            component={StatusScreen}
          />
          <Drawer.Screen
            options={{ title: 'Dynamic order' }}
            name={Nav.DYNAMIC_ORDER}
            component={DynamicOrderScreen}
          />
          <Drawer.Screen
            options={{ title: 'Ref management' }}
            name={Nav.REF_MANAGEMENT}
            component={ManagingRefsScreen}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </A11yProvider>
  );
};
