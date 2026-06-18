package com.reactnativea11y.modules;

import static android.content.res.Configuration.HARDKEYBOARDHIDDEN_NO;
import static android.content.res.Configuration.KEYBOARD_NOKEYS;
import static android.content.res.Configuration.KEYBOARD_UNDEFINED;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;

import androidx.annotation.NonNull;

import com.reactnativea11y.A11yKeyboardConnectedModuleSpec;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Physical-keyboard connection status — ported from
 * react-native-is-keyboard-connected's IsKeyboardConnectedModule into the
 * react-native-a11y package. Emits the `keyboardStatus` event with
 * `{ status: boolean }` when the device hardware-keyboard configuration changes.
 */
public class A11yKeyboardConnectedModule extends A11yKeyboardConnectedModuleSpec implements LifecycleEventListener {
  public static final String KEYBOARD_STATUS_EVENT = "keyboardStatus";
  public static final String EVENT_PROP = "status";
  public static final String NAME = "A11yKeyboardConnectedModule";

  private final ReactApplicationContext reactContext;
  private final BroadcastReceiver receiver;
  private boolean isBroadcastRegistered = false;
  private int listenerCount = 0;

  public A11yKeyboardConnectedModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;

    context.addLifecycleEventListener(this);
    receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_CONFIGURATION_CHANGED.equals(intent.getAction())) {
          Configuration newConfig = context.getResources().getConfiguration();
          keyboardChanged(newConfig.hardKeyboardHidden == HARDKEYBOARDHIDDEN_NO);
        }
      }
    };
  }

  private boolean isConnected() {
    final int keyboard = reactContext.getResources().getConfiguration().keyboard;
    return keyboard != KEYBOARD_UNDEFINED && keyboard != KEYBOARD_NOKEYS;
  }

  private void keyboardChanged(Boolean info) {
    final WritableMap params = Arguments.createMap();
    params.putBoolean(EVENT_PROP, info);
    sendEvent(KEYBOARD_STATUS_EVENT, params);
  }

  private void sendEvent(String eventName, @NonNull WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @Override
  @ReactMethod
  public void isKeyboardConnected(Promise promise) {
    promise.resolve(isConnected());
  }

  private void registerBroadcast() {
    if (isBroadcastRegistered) return;
    isBroadcastRegistered = true;

    final Activity activity = reactContext.getCurrentActivity();
    if (activity != null) {
      activity.registerReceiver(receiver, new IntentFilter(Intent.ACTION_CONFIGURATION_CHANGED));
    }
  }

  private void unregisterBroadcast() {
    if (!isBroadcastRegistered) return;
    isBroadcastRegistered = false;

    final Activity activity = reactContext.getCurrentActivity();
    if (activity == null) return;
    try {
      activity.unregisterReceiver(receiver);
    } catch (java.lang.IllegalArgumentException ignored) {
    }
  }

  @Override
  @ReactMethod
  public void addListener(String eventName) {
    if (listenerCount == 0) {
      registerBroadcast();
    }
    listenerCount += 1;
  }

  @Override
  @ReactMethod
  public void removeListeners(double count) {
    listenerCount -= (int) count;
    if (listenerCount <= 0) {
      listenerCount = 0;
      unregisterBroadcast();
    }
  }

  @Override
  public void onHostResume() {
    if (listenerCount != 0) {
      registerBroadcast();
    }
  }

  @Override
  public void onHostPause() {
    unregisterBroadcast();
  }

  @Override
  public void onHostDestroy() {
  }
}
