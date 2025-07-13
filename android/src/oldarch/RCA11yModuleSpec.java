package com.reactnativea11y;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;

import androidx.annotation.NonNull;

abstract class RCA11yModuleSpec extends ReactContextBaseJavaModule {
  RCA11yModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void isA11yReaderEnabled(Promise promise);
  public abstract void isKeyboardConnected(Promise promise);
  public abstract void announceForAccessibility(String announcement);
  public abstract void announceScreenChange(String screenName);
  public abstract void setAccessibilityFocus(double nativeTag);
  public abstract void setKeyboardFocus(double nativeTag);
  public abstract void setPreferredKeyboardFocus(double nativeTag);
  public abstract void setA11yOrder(@NonNull ReadableArray reactTags, Double _tag);
}

