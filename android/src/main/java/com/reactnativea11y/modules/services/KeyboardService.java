package com.reactnativea11y.modules.services;

import static android.content.res.Configuration.HARDKEYBOARDHIDDEN_NO;
import static android.content.res.Configuration.KEYBOARD_NOKEYS;
import static android.content.res.Configuration.KEYBOARD_UNDEFINED;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerModule;

public class KeyboardService implements LifecycleEventListener {
  private final String NEW_CONFIG = "newConfig";
  private final String ON_CONFIGURATION_CHANGED = "onConfigurationChanged";

  private ReactApplicationContext context;
  private BroadcastReceiver receiver;

  public boolean isKeyboardConnected() {
    int keyboard = context.getResources().getConfiguration().keyboard;
    return keyboard != KEYBOARD_UNDEFINED && keyboard != KEYBOARD_NOKEYS;
  }

  public KeyboardService(ReactApplicationContext context) {
    this.context = context;
    context.addLifecycleEventListener(this);
    receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        Configuration newConfig = intent.getParcelableExtra(NEW_CONFIG);
        keyboardChanged(newConfig.hardKeyboardHidden == HARDKEYBOARDHIDDEN_NO);
      }
    };
    keyboardChanged(isKeyboardConnected());
    context.addLifecycleEventListener(this);
  }

  public void keyboardChanged(Boolean info) {
    Log.i("Keyboard was changed", String.valueOf(info));
  }

  public void setKeyboardFocus(int tag) {
    Activity activity = context.getCurrentActivity();
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    if (uiManager == null || activity == null) {
      return;
    }

    try {
      View view = uiManager.resolveView(tag);
      activity.runOnUiThread(view::requestFocus);
    } catch (IllegalViewOperationException error) {
      Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
    }
  }

  @Override
  public void onHostResume() {
    Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }
    activity.registerReceiver(receiver, new IntentFilter(ON_CONFIGURATION_CHANGED));
  }

  @Override
  public void onHostPause() {
    Activity activity = context.getCurrentActivity();
    if (activity == null) return;
    try {
      activity.unregisterReceiver(receiver);
    } catch (java.lang.IllegalArgumentException e) {
    }
  }

  @Override
  public void onHostDestroy() {

  }
}
