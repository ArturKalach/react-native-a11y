package com.reactnativea11y.modules;

import androidx.annotation.Nullable;

import com.reactnativea11y.A11yAnnounceModuleSpec;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class A11yAnnounceModule extends A11yAnnounceModuleSpec {

  public static final String NAME = "A11yAnnounceModule";

  public A11yAnnounceModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  // stub — announcement is handled by the JS layer on Android (AccessibilityInfo)
  @Override
  @ReactMethod
  public void announce(String message, @Nullable ReadableMap options, Promise promise) {
    promise.resolve(null);
  }

  @Override
  @ReactMethod
  public void cancel(String id, Promise promise) {
    promise.resolve(null);
  }

  @Override
  @ReactMethod
  public void cancelAll(Promise promise) {
    promise.resolve(null);
  }
}
