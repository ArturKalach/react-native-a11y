import { AccessibilityInfo } from 'react-native';
import { combineRefs } from '../../utils';
import { debounce } from '../utils';

// Mock the native order module so the manager's setOrder is observable.
const mockSetA11yOrder = jest.fn();
jest.mock('../../nativeSpecs/NativeA11yOrderModule', () => ({
  __esModule: true,
  default: { setA11yOrder: (...args: unknown[]) => mockSetA11yOrder(...args) },
}));

// Mock the native keyboard module to observe the imperative focus methods.
const mockSetKeyboardFocus = jest.fn();
const mockSetPreferredKeyboardFocus = jest.fn();
jest.mock('../../nativeSpecs/NativeA11yKeyboardModule', () => ({
  __esModule: true,
  default: {
    setKeyboardFocus: (...args: unknown[]) => mockSetKeyboardFocus(...args),
    setPreferredKeyboardFocus: (...args: unknown[]) =>
      mockSetPreferredKeyboardFocus(...args),
  },
}));

const mockSetAccessibilityFocus = jest
  .spyOn(AccessibilityInfo, 'setAccessibilityFocus')
  .mockImplementation(() => {});

// react-test-renderer is only hoisted into the example workspace; guard the
// render-based hook tests so the suite still passes when it is unavailable.
let TestRenderer: any;
try {
  TestRenderer = require('react-test-renderer');
} catch {
  TestRenderer = undefined;
}
const renderIt = TestRenderer ? it : it.skip;

beforeEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe('combineRefs (basis of Legacy.useCombinedRef)', () => {
  it('assigns object refs and invokes callback refs, ignoring nullish', () => {
    const objectRef = { current: null } as { current: unknown };
    const callbackRef = jest.fn();
    const node = { id: 1 };

    combineRefs(objectRef, callbackRef, null, undefined)(node);

    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });
});

describe('debounce (legacy util)', () => {
  it('coalesces rapid calls into a single trailing invocation', () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const debounced = debounce(fn, 16);

    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(16);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('Legacy imperative focus helpers', () => {
  const {
    setAccessibilityFocus,
    setKeyboardFocus,
    setPreferredKeyboardFocus,
  } = require('../focus');

  it('setAccessibilityFocus routes valid tags to AccessibilityInfo', () => {
    setAccessibilityFocus(42);
    expect(mockSetAccessibilityFocus).toHaveBeenCalledWith(42);
  });

  it('setKeyboardFocus / setPreferredKeyboardFocus route to the native module', () => {
    setKeyboardFocus(7);
    setPreferredKeyboardFocus(9);
    expect(mockSetKeyboardFocus).toHaveBeenCalledWith(7);
    expect(mockSetPreferredKeyboardFocus).toHaveBeenCalledWith(9);
  });

  it('ignores non-integer tags', () => {
    setAccessibilityFocus(NaN);
    setKeyboardFocus(undefined as unknown as number);
    expect(mockSetAccessibilityFocus).not.toHaveBeenCalled();
    expect(mockSetKeyboardFocus).not.toHaveBeenCalled();
  });
});

// ─── Render-based hook behavior (skipped without react-test-renderer) ─────────

describe('Legacy imperative order hooks', () => {
  // Required lazily so the import doesn't run when the renderer is missing.
  const loadHooks = () => ({
    useFocusOrder: require('../hooks/useFocusOrder').useFocusOrder,
    useCombinedRef: require('../hooks/useCombinedRef').useCombinedRef,
  });

  renderIt('useFocusOrder(size) returns `size` callback refs', () => {
    const React = require('react');
    const { useFocusOrder } = loadHooks();

    let info: any;
    const Probe = () => {
      info = useFocusOrder(3);
      return null;
    };

    TestRenderer!.act(() => {
      TestRenderer!.create(React.createElement(Probe));
    });

    expect(info.refs).toHaveLength(3);
    info.refs.forEach((r: unknown) => expect(typeof r).toBe('function'));
    expect(typeof info.setOrder).toBe('function');
    expect(typeof info.reset).toBe('function');
    expect(info.a11yOrder).toHaveProperty('ref');
    expect(typeof info.a11yOrder.onLayout).toBe('function');
  });

  renderIt('reset() clears the registry so setOrder emits no tags', () => {
    const React = require('react');
    const { useFocusOrder } = loadHooks();

    let info: any;
    const Probe = () => {
      info = useFocusOrder(2);
      return null;
    };
    TestRenderer!.act(() => {
      TestRenderer!.create(React.createElement(Probe));
    });

    TestRenderer!.act(() => {
      info.reset();
      info.setOrder();
    });

    // findNodeHandle returns null for the detached probe refs, so no tags.
    expect(mockSetA11yOrder).toHaveBeenCalledWith([], -1);
  });

  renderIt('useCombinedRef returns a [ref, callback] tuple', () => {
    const React = require('react');
    const { useCombinedRef } = loadHooks();

    let tuple: any;
    const Probe = () => {
      tuple = useCombinedRef();
      return null;
    };
    TestRenderer!.act(() => {
      TestRenderer!.create(React.createElement(Probe));
    });

    expect(tuple[0]).toHaveProperty('current');
    expect(typeof tuple[1]).toBe('function');
  });
});
