import { findNodeHandle, NativeEventEmitter } from 'react-native';
import { KEYBOARD_STATUS_EVENT } from './A11yModule.conts';

import type {
  A11yOrderInfo,
  IA11yModule,
  RefObjType,
  StatusCallback,
} from './A11yModule.types';
import * as RCA11yModule from './RCA11yModule';

const GC_FRAMEWORK_LINKING_ERROR = `GC_FRAMEWORK_LINKING_ERROR`;

class A11yModuleIOSImpl implements IA11yModule {
  private _currentFocusedTag: number | null = null;

  set currentFocusedTag(value: number) {
    this._currentFocusedTag = value;
  }

  isKeyboardConnected = () =>
    RCA11yModule.isKeyboardConnected().catch((e) => {
      if (e.code === GC_FRAMEWORK_LINKING_ERROR) {
        console.error(e.message);
      }

      return true;
    });

  keyboardStatusListener = (callback: StatusCallback) => {
    const eventEmitter = new NativeEventEmitter(RCA11yModule.RCA11y);
    const eventListener = eventEmitter.addListener(
      KEYBOARD_STATUS_EVENT,
      callback
    );
    return () => eventListener.remove();
  };

  announceForAccessibility = (announcement: string) => {
    RCA11yModule.announceForAccessibility(announcement);
  };

  announceScreenChange = (announcement: string) => {
    RCA11yModule.announceScreenChange(announcement);
  };

  setA11yFocus = (ref: RefObjType) => {
    const tag = findNodeHandle(ref.current);
    if (tag) {
      RCA11yModule.setAccessibilityFocus(tag);
    }
  };

  setPreferredKeyboardFocus = (tag: number, targetTag: number) => {
    if (Number.isInteger(tag) && Number.isInteger(targetTag)) {
      RCA11yModule.setPreferredKeyboardFocus(tag, targetTag);
    }
  };

  setKeyboardFocus = (ref: RefObjType) => {
    const tag = findNodeHandle(ref.current);

    if (
      this._currentFocusedTag &&
      tag &&
      Number.isInteger(this._currentFocusedTag) &&
      Number.isInteger(tag)
    ) {
      RCA11yModule.setKeyboardFocus(this._currentFocusedTag, tag);
    }
  };

  focusFirstInteractiveElement = (refToFocus?: RefObjType) => {
    if (refToFocus && refToFocus?.current) {
      this.setA11yFocus(refToFocus);
    } else {
      this.announceScreenChange('');
    }
  };

  setA11yElementsOrder = <T>({ tag, views }: A11yOrderInfo<T>) => {
    if (!tag) return;

    const targetView = findNodeHandle(tag.current as React.Component<any, any>);
    if (!targetView) return;

    const tags = views
      .map((view) => findNodeHandle(view as React.Component<any, any>))
      .filter((view) => Boolean(view)) as number[];

    RCA11yModule?.setA11yOrder?.(tags, targetView);
  };
}

export const A11yModule = new A11yModuleIOSImpl();
