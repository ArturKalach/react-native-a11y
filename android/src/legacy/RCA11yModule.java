package com.reactnativea11y;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.reactnativea11y.services.A11yReader;
import com.reactnativea11y.services.KeyboardService;

public class RCA11yModule extends ReactContextBaseJavaModule {
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
  public void setKeyboardFocus(int tag) {
    module.setKeyboardFocus(tag);
  }

  @ReactMethod
  public void announceScreenChange(String screenName) {
    module.announceScreenChange(screenName);
  }

  @ReactMethod
  public void isA11yReaderEnabled(Promise promise) {
    module.isA11yReaderEnabled(promise);
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void setA11yOrder(@NonNull ReadableArray reactTags) {
    module.setA11yOrder(reactTags);
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
