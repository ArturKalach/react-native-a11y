package com.reactnativea11y;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.reactnativea11y.modules.services.A11yReader;
import com.reactnativea11y.modules.services.KeyboardService;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

public class RCA11yModule extends NativeA11yModuleSpec {
  private RCA11yModuleImpl module;

  RCA11yModule(ReactApplicationContext context) {
    super(context);
    module = new RCA11yModuleImpl(context);
  }

  @Override
  public String getName() {
    return module.getName();
  }

  public void initialize() {
    module.initialize();
  }

  @ReactMethod
  public void isKeyboardConnected(Promise promise) {
    module.isKeyboardConnected(promise);
  }

  @ReactMethod
  public void setKeyboardFocus(double nativeTag, Double nextTag) {
    module.setKeyboardFocus((int)nativeTag);
  }

  @ReactMethod
  public void announceScreenChange(String screenName) {
    module.announceScreenChange(screenName);
  }

  @Override
  public void setAccessibilityFocus(double nativeTag) {
    //stub
  }


  @Override
  public void setPreferredKeyboardFocus(double nativeTag, double nextTag) {
    //stub
  }


  @Override
  public void announceForAccessibility(String announcement) {
    //stub
  }

  @ReactMethod
  public void isA11yReaderEnabled(Promise promise) {
    module.isA11yReaderEnabled(promise);
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void setA11yOrder(@NonNull ReadableArray reactTags, Double _tag) {
    module.setA11yOrder(reactTags);
  }

  @ReactMethod
  public void addListener(String _eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer _count) {

  }
}
