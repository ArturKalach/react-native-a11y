import {
  AccessibilityInfo,
  findNodeHandle,
  InteractionManager,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type {
  A11yOrderInfo,
  A11yNativeModule,
  IA11yModule,
  StatusCallback,
} from './A11yModule.types';
import { noop } from '../../utils';
import { A11Y_STATUS_EVENT, KEYBOARD_STATUS_EVENT } from './A11yModule.conts';

const NativeModule =
  NativeModules.RCA11yModule as A11yNativeModule;

class A11yAndroidImpl implements IA11yModule {
  announceForAccessibility(announcement: string) {
    AccessibilityInfo.announceForAccessibility(announcement);
  }

  isA11yReaderEnabled = NativeModule.isA11yReaderEnabled;
  isKeyboardConnected = NativeModule.isKeyboardConnected;

  a11yStatusListener = (callback: StatusCallback) => {
    const eventEmitter = new NativeEventEmitter(NativeModules.RCA11yModule);
    const eventListener = eventEmitter.addListener(A11Y_STATUS_EVENT, callback);
    return eventListener.remove;
  }

  keyboardStatusListener = (callback: StatusCallback) => {
    const eventEmitter = new NativeEventEmitter(NativeModules.RCA11yModule);
    const eventListener = eventEmitter.addListener(KEYBOARD_STATUS_EVENT, callback);
    return eventListener.remove;
  }

  

  setKeyboardFocus(ref:  React.RefObject<React.Component>) {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      InteractionManager.runAfterInteractions(() => {
        NativeModule.setKeyboardFocus(tag);
      });
    }
  }

  focusFirstInteractiveElement = this.setA11yFocus

  announceScreenChange(announcement: string) {
    NativeModule.announceScreenChange(announcement);
  }

  setPreferredKeyboardFocus = noop

  setA11yFocus(ref: React.RefObject<React.Component>) {
      const tag = findNodeHandle(ref.current);
      if(tag) {
        AccessibilityInfo.setAccessibilityFocus(tag);
      }
  }

  setA11yElementsOrder = <T>({ views }: A11yOrderInfo<T>) => {
    const tags = views
      .map(view => findNodeHandle(view as React.Component ))
      .filter(view => Boolean(view));
    NativeModule.setA11yOrder?.(tags as number[]);
  }
}

export const A11yModule = new A11yAndroidImpl();
