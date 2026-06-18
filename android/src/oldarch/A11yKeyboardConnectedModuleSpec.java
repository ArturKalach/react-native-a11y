package com.reactnativea11y;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class A11yKeyboardConnectedModuleSpec extends ReactContextBaseJavaModule {
  protected A11yKeyboardConnectedModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void isKeyboardConnected(Promise promise);

  public abstract void addListener(String eventName);

  public abstract void removeListeners(double count);
}
