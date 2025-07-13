import type { AccessibilityChangeEventName } from 'react-native';

const A11Y_DEPRECATED = 'change';
class A11yConfig {
  private a11yServiceChangeEvent: AccessibilityChangeEventName =
    A11Y_DEPRECATED;

  init({ a11yEventName }: { a11yEventName: AccessibilityChangeEventName }) {
    this.a11yServiceChangeEvent = a11yEventName;
  }

  get a11yEventName() {
    return this.a11yServiceChangeEvent;
  }
}

export const a11yConfig = new A11yConfig();
