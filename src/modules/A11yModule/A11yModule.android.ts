import React from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  InteractionManager,
  NativeEventEmitter,
} from "react-native";
import type {
  A11yOrderInfo,
  IA11yModule,
  StatusCallback,
} from "./A11yModule.types";
import { noop } from "../../utils";
import { KEYBOARD_STATUS_EVENT } from "./A11yModule.conts";

import { RCA11yModule } from "./RCA11yModule";

class A11yAndroidImpl implements IA11yModule {
  announceForAccessibility(announcement: string) {
    AccessibilityInfo.announceForAccessibility(announcement);
  }

  isKeyboardConnected = NativeModule.isKeyboardConnected;

  keyboardStatusListener = (callback: StatusCallback) => {
    const eventEmitter = new NativeEventEmitter(RCA11yModule);
    const eventListener = eventEmitter.addListener(
      KEYBOARD_STATUS_EVENT,
      callback,
    );
    return eventListener.remove;
  };

  setKeyboardFocus(ref: React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      InteractionManager.runAfterInteractions(() => {
        RCA11yModule.setKeyboardFocus(tag);
      });
    }
  }

  focusFirstInteractiveElement = this.setA11yFocus;

  announceScreenChange(announcement: string) {
    RCA11yModule.announceScreenChange(announcement);
  }

  setPreferredKeyboardFocus = noop;

  setA11yFocus(ref: React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  }

  setA11yElementsOrder = <T>({ views }: A11yOrderInfo<T>) => {
    const tags = views
      .map(view => findNodeHandle(view as React.Component))
      .filter(view => Boolean(view));
    RCA11yModule.setA11yOrder?.(tags as number[]);
  };
}

export const A11yModule = new A11yAndroidImpl();
