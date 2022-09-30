package com.reactnativea11y.services;

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
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerModule;

public class KeyboardService implements LifecycleEventListener {
  private final String NEW_CONFIG = "newConfig";
  private final String ON_CONFIGURATION_CHANGED = "onConfigurationChanged";

  private final ReactApplicationContext context;
  private final BroadcastReceiver receiver;

  public boolean isKeyboardConnected() {
    final int keyboard = context.getResources().getConfiguration().keyboard;
    return keyboard != KEYBOARD_UNDEFINED && keyboard != KEYBOARD_NOKEYS;
  }

  public KeyboardService(ReactApplicationContext context) {
    this.context = context;
    context.addLifecycleEventListener(this);
    receiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        final Configuration newConfig = intent.getParcelableExtra(NEW_CONFIG);
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
    final UIManager uiManager = context.getNativeModule(UIManagerModule.class);
    final Activity activity = context.getCurrentActivity();

    if (uiManager == null || activity == null) {
      return;
    }

    activity.runOnUiThread(() -> {
      try {
        View view = uiManager.resolveView(tag);
        view.requestFocus();
      } catch (IllegalViewOperationException error) {
        Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
      }
    });
  }

  @Override
  public void onHostResume() {
    final Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }
    activity.registerReceiver(receiver, new IntentFilter(ON_CONFIGURATION_CHANGED));
  }

  @Override
  public void onHostPause() {
    final Activity activity = context.getCurrentActivity();
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
