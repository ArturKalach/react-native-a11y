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

import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.reactnativea11y.RCA11yUIManagerHelper;

public class KeyboardService implements LifecycleEventListener {
  private final ReactApplicationContext context;
  private final BroadcastReceiver receiver;
  private boolean isBroadcastRegistered = false;

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
        try {
          if (Intent.ACTION_CONFIGURATION_CHANGED.equals(intent.getAction())) {
            Configuration newConfig = context.getResources().getConfiguration();
            if (newConfig != null) {
              keyboardChanged(newConfig.hardKeyboardHidden == HARDKEYBOARDHIDDEN_NO);
            }
          }
        } catch (Exception e) {
          Log.e("RNA11y", "Unexpected broadcast error");
        }
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


  private void registerBroadcast() {
    if (isBroadcastRegistered) return;
    isBroadcastRegistered = true;
    final Activity activity = context.getCurrentActivity();

    if (activity != null) {
      activity.registerReceiver(receiver, new IntentFilter(Intent.ACTION_CONFIGURATION_CHANGED));
    }
  }

  private void unregisterBroadcast() {
    if (!isBroadcastRegistered) return;
    isBroadcastRegistered = false;

    final Activity activity = context.getCurrentActivity();
    if (activity == null) return;
    try {
      activity.unregisterReceiver(receiver);
    } catch (java.lang.IllegalArgumentException e) {
    }
  }

  @Override
  @SuppressLint("UnspecifiedRegisterReceiverFlag")
  public void onHostResume() {
    registerBroadcast();
  }

  @Override
  public void onHostPause() {
    unregisterBroadcast();
  }

  @Override
  public void onHostDestroy() {

  }
}
