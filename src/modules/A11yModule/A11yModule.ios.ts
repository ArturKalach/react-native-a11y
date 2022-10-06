import {
  findNodeHandle,
  NativeModules,
  NativeEventEmitter,
} from "react-native";
import { KEYBOARD_STATUS_EVENT } from "./A11yModule.conts";

import type {
  A11yOrderInfo,
  A11yNativeModule,
  IA11yModule,
  StatusCallback,
} from "./A11yModule.types";

const NativeModule = NativeModules.RCA11yModule as A11yNativeModule;

class A11yModuleIOSImpl implements IA11yModule {
  private _currentFocusedTag: number | null = null;

  set currentFocusedTag(value: number) {
    this._currentFocusedTag = value;
  }

  isKeyboardConnected = NativeModule.isKeyboardConnected;

  keyboardStatusListener = (callback: StatusCallback) => {
    const eventEmitter = new NativeEventEmitter(NativeModules.RCA11yModule);
    const eventListener = eventEmitter.addListener(
      KEYBOARD_STATUS_EVENT,
      callback,
    );
    return eventListener.remove;
  };

  announceForAccessibility = (announcement: string) => {
    NativeModule.announceForAccessibility(announcement);
  };

  announceScreenChange = (announcement: string) => {
    NativeModule.announceScreenChange(announcement);
  };

  setA11yFocus = (ref: React.RefObject<React.Component>) => {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      NativeModule.setAccessibilityFocus(tag);
    }
  };

  setPreferredKeyboardFocus = (tag: number, targetTag: number) => {
    if (Number.isInteger(tag) && Number.isInteger(targetTag)) {
      NativeModule.setPreferredKeyboardFocus(tag, targetTag);
    }
  };

  setKeyboardFocus = (ref: React.RefObject<React.Component>) => {
    const tag = findNodeHandle(ref.current);
    if (
      this._currentFocusedTag &&
      tag &&
      Number.isInteger(this._currentFocusedTag) &&
      Number.isInteger(tag)
    ) {
      NativeModule.setKeyboardFocus(this._currentFocusedTag, tag);
    }
  };

  focusFirstInteractiveElement = (
    refToFocus?: React.RefObject<React.Component>,
  ) => {
    if (refToFocus && refToFocus?.current) {
      this.setA11yFocus(refToFocus);
    } else {
      this.announceScreenChange("");
    }
  };

  setA11yElementsOrder = <T>({ tag, views }: A11yOrderInfo<T>) => {
    if (!tag) return;

    const targetView = findNodeHandle(tag.current as React.Component);
    if (!targetView) return;

    const tags = views
      .map(view => findNodeHandle(view as React.Component))
      .filter(view => Boolean(view)) as number[];

    NativeModule?.setA11yOrder?.(tags, targetView);
  };
}

export const A11yModule = new A11yModuleIOSImpl();
