package com.reactnativea11y.modules;

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

public class RCA11yModule extends ReactContextBaseJavaModule {
  public static final String REACT_CLASS = "RCA11yModule";
  public static final String A11Y_STATUS_EVENT = "a11yStatus";
  public static final String KEYBOARD_STATUS_EVENT = "keyboardStatus";
  public static final String EVENT_PROP = "status";

  private A11yReader a11yReader;
  private final ReactApplicationContext context;
  private KeyboardService keyboardService;

  @Override
  public void initialize() {
    super.initialize();
    this.keyboardService = new KeyboardService(context) {
      @Override
      public void keyboardChanged(Boolean info) {
        kChanged(info);
      }
    };
    this.a11yReader = new A11yReader(context) {
      @Override
      public void accessibilityChanged(Boolean isEnabled) {
        a11yChanged(isEnabled);
      }
    };
  }

  public RCA11yModule(ReactApplicationContext applicationContext) {
    super(applicationContext);
    context = applicationContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }


  private void a11yChanged(Boolean a11yState) {
    final WritableMap params = Arguments.createMap();
    params.putBoolean(EVENT_PROP, a11yState);
    sendEvent(context, A11Y_STATUS_EVENT, params);
  }

  private void kChanged(Boolean info) {
    final WritableMap params = Arguments.createMap();
    params.putBoolean(EVENT_PROP, info);
    sendEvent(context, KEYBOARD_STATUS_EVENT, params);
  }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @ReactMethod
  public void setKeyboardFocus(int tag) {
    this.keyboardService.setKeyboardFocus(tag);
  }

  @ReactMethod
  public void announceScreenChange(String screenName) {
    this.a11yReader.announceScreenChange(screenName);
  }

  @ReactMethod
  public void isA11yReaderEnabled(Promise promise) {
    try {
      promise.resolve(this.a11yReader.isTalkBackEnabled());
    } catch(Exception e) {
      promise.reject("Create Event Error", e);
    }
  }


  @ReactMethod
  public void isKeyboardConnected(Promise promise) {
    promise.resolve(this.keyboardService.isKeyboardConnected());
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @ReactMethod
  public void setA11yOrder(@NonNull ReadableArray reactTags) {
    this.a11yReader.setA11yOrder(reactTags);
  }

  @ReactMethod
  public void addListener(String eventName) {

  }

  @ReactMethod
  public void removeListeners(Integer count) {

  }
}
