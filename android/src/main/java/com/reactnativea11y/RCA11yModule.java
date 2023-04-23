package com.reactnativea11y;

import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

public class RCA11yModule extends RCA11yModuleSpec{
  public static final String NAME = "RCA11yModule";
  private RCA11yModuleImpl module;

  RCA11yModule(ReactApplicationContext context) {
    super(context);
    module = new RCA11yModuleImpl(context);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void isA11yReaderEnabled(Promise promise) {
    promise.resolve(true);
  }

  @ReactMethod
  public void isKeyboardConnected(Promise promise) {
    module.isKeyboardConnected(promise);
  }

  @ReactMethod
  public void announceForAccessibility(String announcement) {
    //stub
  }

  @ReactMethod
  public void announceScreenChange(String screenName) {
    module.announceScreenChange(screenName);
  }

  @ReactMethod
  public void setAccessibilityFocus(double nativeTag) {
    //stub
  }

  @ReactMethod
  public void setKeyboardFocus(double nativeTag, Double _nextTag) {
    module.setKeyboardFocus((int)nativeTag);
  }

  @ReactMethod
  public void setPreferredKeyboardFocus(double nativeTag, double nextTag) {
    //stub
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void setA11yOrder(@NonNull ReadableArray reactTags, Double _tag) {
    module.setA11yOrder(reactTags);
  }

  // Required for rn built in EventEmitter Calls.
  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
