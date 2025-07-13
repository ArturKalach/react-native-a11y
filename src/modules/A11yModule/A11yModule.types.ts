import React from 'react';
import type { RefObject } from 'react';
import type { View } from 'react-native';

export type A11yOrderInfo<T> = {
  tag?: RefObject<View>;
  views: T[];
};

export type A11yNativeModule = {
  isKeyboardConnected: () => Promise<boolean>;
  announceForAccessibility: (announcement: string) => void;
  announceScreenChange: (announcement: string) => void;
  setAccessibilityFocus: (nativeTag: number) => void;
  setKeyboardFocus: (nativeTag: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setA11yOrder: (tags: number[], nativeTag?: number) => void;
};

export type StatusCallback = (e: { status: boolean }) => void;

export type RefObjType = RefObject<React.Component | null>;

export interface IA11yModule {
  isKeyboardConnected: () => Promise<boolean>;
  keyboardStatusListener: (callback: StatusCallback) => () => void;
  announceForAccessibility: (announcement: string) => void;
  announceScreenChange: (announcement: string) => void;
  setA11yFocus: (ref: RefObjType) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setKeyboardFocus: (ref: RefObjType) => void;
  focusFirstInteractiveElement: (ref: RefObjType) => void;
  setA11yElementsOrder: <T>(info: A11yOrderInfo<T>) => void;
}
