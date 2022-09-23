import { RefObject } from "react";

export type A11yOrderInfo<T> = {
  tag?: RefObject<T>;
  views: T[];
};

export type A11yNativeModule = {
  isA11yReaderEnabled: () => Promise<boolean>;
  isKeyboardConnected: () => Promise<boolean>;
  announceForAccessibility: (announcement: string) => void;
  announceScreenChange: (announcement: string) => void;
  setAccessibilityFocus: (nativeTag: number) => void;
  setKeyboardFocus: (nativeTag: number, nextTag?: number) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setA11yOrder: (tags: number[], nativeTag?: number) => void;
};

export type StatusCallback = (e: { status: boolean }) => void;

export interface IA11yModule {
  currentFocusedTag?: number;

  isA11yReaderEnabled: () => Promise<boolean>;
  isKeyboardConnected: () => Promise<boolean>;
  a11yStatusListener: (callback: StatusCallback) => void;
  keyboardStatusListener: (callback: StatusCallback) => void;
  announceForAccessibility: (announcement: string) => void;
  announceScreenChange: (announcement: string) => void;
  setA11yFocus: (ref: React.RefObject<React.Component>) => void;
  setPreferredKeyboardFocus: (nativeTag: number, nextTag: number) => void;
  setKeyboardFocus: (nativeTag: React.RefObject<React.Component>) => void;
  focusFirstInteractiveElement: (ref: React.RefObject<React.Component>) => void;
  setA11yElementsOrder: <T>(info: A11yOrderInfo<T>) => void;
}
