import {
  A11y,
  announce,
  cancel,
  cancelAll,
  ScreenReader,
  Keyboard,
  isKeyboardConnected,
  keyboardStatusListener,
  isScreenReaderEnabled,
  screenReaderStatusListener,
  Legacy,
  withKeyboardFocus,
  combineRefs,
  A11yProvider,
  useIsScreenReaderEnabled,
  useIsScreenReaderEnabledRef,
  useIsKeyboardConnected,
  useIsKeyboardConnectedRef,
  KeyboardOrderFocusGroup,
  useOrderFocusGroup,
  // deprecated aliases
  KeyboardFocusTextInput,
  Focus,
  K,
} from '../index';

describe('react-native-a11y public API (Step 2)', () => {
  it('exposes the unified A11y namespace', () => {
    const expected = [
      'View',
      'Pressable',
      'Input',
      'Order',
      'Index',
      'Card',
      'FocusTrap',
      'FocusFrame',
      'PaneTitle',
      'ScreenChange',
      'FocusGroup',
      'KeyboardFocusView',
    ];
    expect(Object.keys(A11y).sort()).toEqual(expected.sort());
    // every namespace entry is a renderable component
    Object.values(A11y).forEach((C) => expect(C).toBeTruthy());
  });

  it('exposes imperative announcement + keyboard APIs', () => {
    expect(typeof announce).toBe('function');
    expect(typeof cancel).toBe('function');
    expect(typeof cancelAll).toBe('function');
    expect(typeof ScreenReader.announce).toBe('function');
    expect(typeof Keyboard.dismiss).toBe('function');
    expect(typeof isKeyboardConnected).toBe('function');
    expect(typeof keyboardStatusListener).toBe('function');
    expect(typeof isScreenReaderEnabled).toBe('function');
    expect(typeof screenReaderStatusListener).toBe('function');
  });

  it('exposes the Legacy 0.7 migration namespace', () => {
    expect(Object.keys(Legacy).sort()).toEqual(
      [
        'A11yOrder',
        'useCombinedRef',
        'useFocusOrder',
        'useDynamicFocusOrder',
        'combineRefs',
        'setAccessibilityFocus',
        'setKeyboardFocus',
        'setPreferredKeyboardFocus',
      ].sort()
    );
    expect(typeof Legacy.useFocusOrder).toBe('function');
    expect(typeof Legacy.useDynamicFocusOrder).toBe('function');
    expect(typeof Legacy.useCombinedRef).toBe('function');
    expect(typeof Legacy.setAccessibilityFocus).toBe('function');
    expect(typeof Legacy.setKeyboardFocus).toBe('function');
    expect(typeof Legacy.setPreferredKeyboardFocus).toBe('function');
    expect(Legacy.combineRefs).toBe(combineRefs);
    // distinct from the declarative A11y.Order
    expect(Legacy.A11yOrder).not.toBe(A11y.Order);
  });

  it('exposes providers and the HOC', () => {
    expect(typeof withKeyboardFocus).toBe('function');
    expect(typeof combineRefs).toBe('function');
    expect(typeof A11yProvider).toBe('function');
    expect(typeof useIsScreenReaderEnabled).toBe('function');
    expect(typeof useIsScreenReaderEnabledRef).toBe('function');
    expect(typeof useIsKeyboardConnected).toBe('function');
    expect(typeof useIsKeyboardConnectedRef).toBe('function');
    expect(typeof KeyboardOrderFocusGroup).toBe('function');
    expect(typeof useOrderFocusGroup).toBe('function');
  });

  it('keeps backward-compatible aliases', () => {
    expect(KeyboardFocusTextInput).toBe(A11y.Input);
    expect(Focus.Trap).toBe(A11y.FocusTrap);
    expect(Focus.Frame).toBe(A11y.FocusFrame);
    expect(K.View).toBe(A11y.View);
    expect(K.Input).toBe(A11y.Input);
    expect(K.Pressable).toBe(A11y.Pressable);
  });
});
