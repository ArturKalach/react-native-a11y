package com.reactnativea11y;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

/** `A11yCard` has no native props on Android (the card pattern is JS-side). */
public abstract class A11yCardManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
}
