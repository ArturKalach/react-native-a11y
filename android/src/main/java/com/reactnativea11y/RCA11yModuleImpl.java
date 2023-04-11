package com.reactnativea11y;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativea11y.services.A11yReader;
import com.reactnativea11y.services.KeyboardService;


public class RCA11yModuleImpl {
  private ReactApplicationContext context;
  private A11yReader a11yReader;
  private KeyboardService keyboardService;

  public static final String A11Y_STATUS_EVENT = "a11yStatus";
  public static final String KEYBOARD_STATUS_EVENT = "keyboardStatus";
  public static final String EVENT_PROP = "status";

  public RCA11yModuleImpl(ReactApplicationContext context) {
    this.context = context;
    this.initialize();
  }

  public void initialize() {
    this.keyboardService = new KeyboardService(context) {
      @Override
      public void keyboardChanged(Boolean info) {
        kChanged(info);
      }
    };
    this.a11yReader = new A11yReader(context);
  }

  public void kChanged(Boolean info) {
    final WritableMap params = Arguments.createMap();
    params.putBoolean(EVENT_PROP, info);
    sendEvent(context, KEYBOARD_STATUS_EVENT, params);
  }

  private void sendEvent(ReactApplicationContext reactContext,
                         String eventName,
                         @NonNull WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  public void setKeyboardFocus(int tag) {
    this.keyboardService.setKeyboardFocus(tag);
  }

  public void announceScreenChange(String screenName) {
    this.a11yReader.announceScreenChange(screenName);
  }

  @ReactMethod
  public void isKeyboardConnected(Promise promise) {
    promise.resolve(this.keyboardService.isKeyboardConnected());
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  public void setA11yOrder(@NonNull ReadableArray reactTags) {
    this.a11yReader.setA11yOrder(reactTags);
  }
}
