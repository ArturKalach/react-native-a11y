import type { DrawerNavigationProp } from "@react-navigation/drawer";
import * as Names from "./navigation.consts";

export type DrawerParamList = {
  [Names.A11Y_ORDER]: undefined;
  [Names.ABOUT]: undefined;
  [Names.KEYBOARD_FOCUS]: undefined;
  [Names.READER_FOCUS]: undefined;
  [Names.STATUS_SCREEN]: undefined;
  [Names.DYNAMIC_ORDER]: undefined;
  [Names.REF_MANAGEMENT]: undefined;
  [Names.ANDROID_INPUT]: undefined;
};

export type DrawerNavigation = DrawerNavigationProp<DrawerParamList>;
