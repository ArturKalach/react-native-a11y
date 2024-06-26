package com.reactnativea11y.services;


import static android.content.res.Configuration.HARDKEYBOARDHIDDEN_NO;
import static android.content.res.Configuration.KEYBOARD_NOKEYS;
import static android.content.res.Configuration.KEYBOARD_UNDEFINED;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.util.Log;
import android.view.View;
import android.os.Build;

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.reactnativea11y.RCA11yUIManagerHelper;

import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;

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
  }

  public void keyboardChanged(Boolean info) {
    Log.i("Keyboard was changed", String.valueOf(info));
  }

  public void setKeyboardFocus(int tag) {
    final Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }

    activity.runOnUiThread(() -> {
      try {
        RCA11yUIManagerHelper uiHelper = new RCA11yUIManagerHelper(context);
        View view = uiHelper.resolveView(tag);
        view.requestFocus();
      } catch (IllegalViewOperationException error) {
        Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
      }
    });
  }

  @Override
  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  public void onHostResume() {
    final Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }

    /**
     * Starting with Android 14, apps and services that target Android 14 and use context-registered
     * receivers are required to specify a flag to indicate whether or not the receiver should be
     * exported to all other apps on the device: either RECEIVER_EXPORTED or RECEIVER_NOT_EXPORTED
     * <a href="https://developer.android.com/about/versions/14/behavior-changes-14#runtime-receivers-exported"/>
     */
    if (Build.VERSION.SDK_INT >= 34 && context.getApplicationInfo().targetSdkVersion >= 34) {
      final int RECEIVER_NOT_EXPORTED = 4; // Same to Context.RECEIVER_NOT_EXPORTED but it allows to build with older SDK
      activity.registerReceiver(receiver, new IntentFilter(ON_CONFIGURATION_CHANGED), RECEIVER_NOT_EXPORTED);
    } else {
      activity.registerReceiver(receiver, new IntentFilter(ON_CONFIGURATION_CHANGED));
    }
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
