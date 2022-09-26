import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { A11yProvider } from "react-native-a11y";
import {
  ReaderFocusScreen,
  HomeScreen,
  KeyboardFocusScreen,
  A11yOrderScreen,
} from "./src/screens";
import { StatusScreen } from "./src";
import * as Nav from "./navigation";
import { DrawerContent, Header } from "./src/components";

const Drawer = createDrawerNavigator<Nav.DrawerParamList>();

export const App = () => {
  return (
    <A11yProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            // eslint-disable-next-line react/jsx-props-no-spreading
            header: props => <Header {...props} />,
          }}
          drawerContent={DrawerContent}
        >
          <Drawer.Screen
            options={{ title: "About" }}
            name={Nav.ABOUT}
            component={HomeScreen}
          />
          <Drawer.Screen
            options={{ title: "A11y Order" }}
            name={Nav.A11Y_ORDER}
            component={A11yOrderScreen}
          />
          <Drawer.Screen
            options={{ title: "Reader focus" }}
            name={Nav.READER_FOCUS}
            component={ReaderFocusScreen}
          />
          <Drawer.Screen
            options={{ title: "Keyboard focus" }}
            name={Nav.KEYBOARD_FOCUS}
            component={KeyboardFocusScreen}
          />
          <Drawer.Screen
            options={{ title: "Status" }}
            name={Nav.STATUS_SCREEN}
            component={StatusScreen}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </A11yProvider>
  );
};
