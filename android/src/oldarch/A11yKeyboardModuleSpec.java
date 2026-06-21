package com.reactnativea11y;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class A11yKeyboardModuleSpec extends ReactContextBaseJavaModule {
  protected A11yKeyboardModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void dismissKeyboard(Promise promise);

  public abstract void setKeyboardFocus(double nativeTag);

  public abstract void setPreferredKeyboardFocus(double nativeTag);
}
