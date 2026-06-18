package com.reactnativea11y;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableArray;

public abstract class A11yOrderModuleSpec extends ReactContextBaseJavaModule {
  protected A11yOrderModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void setA11yOrder(ReadableArray viewTags, double containerTag);
}
