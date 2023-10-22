package com.reactnativea11y.services;

import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;

import android.accessibilityservice.AccessibilityServiceInfo;
import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.common.ViewUtil;
import com.reactnativea11y.RCA11yUIManagerHelper;

import java.util.ArrayList;
import java.util.List;

public class A11yReader {
  private static final String TALKBACK_SETTING_ACTIVITY_NAME = "com.android.talkback.TalkBackPreferencesActivity";

  private final ReactApplicationContext context;

  public A11yReader(ReactApplicationContext context) {
    this.context = context;
    this.startListening();
  }

  private void startListening() {
    final AccessibilityManager accessibilityManager = (AccessibilityManager) context
      .getSystemService(Context.ACCESSIBILITY_SERVICE);
    if (accessibilityManager != null) {
      accessibilityManager.addAccessibilityStateChangeListener(this::accessibilityChanged);
      accessibilityChanged(accessibilityManager.isEnabled());
    }
  }

  public void accessibilityChanged(Boolean isEnabled) {
    Log.i("A11y was changed", String.valueOf(isEnabled));
  }

  public void announceScreenChange(String screenName) {
    final AccessibilityManager accessibilityManager = (AccessibilityManager) context
      .getSystemService(Context.ACCESSIBILITY_SERVICE);

    if (accessibilityManager == null || !accessibilityManager.isEnabled()) {
      return;
    }

    final AccessibilityEvent event = AccessibilityEvent.obtain(AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED);
    event.getText().add(screenName);

    accessibilityManager.sendAccessibilityEvent(event);
  }


  @RequiresApi(api = Build.VERSION_CODES.N)
  public void setA11yOrder(@NonNull ReadableArray reactTags) {
    final int length = reactTags.size();
    if (length < 2) return;


    final Activity activity = context.getCurrentActivity();

    if (activity == null) {
      return;
    }

    activity.runOnUiThread(() -> {
      try {
        UIManager manager = RCA11yUIManagerHelper.getNativeModule(context, reactTags.getInt(0));

        final ArrayList<View> views = new ArrayList<>();
        for (int i = 0; i < length; i++) {
          try {
            views.add(manager.resolveView(reactTags.getInt(i)));
          } catch (IllegalViewOperationException error) {
            Log.e("ERROR", error.getMessage());
          }
        }
        for (int i = 0; i < views.size() - 1; i++) {
          final View currentView = views.get(i);
          final View nextView = views.get(i + 1);
          currentView.setNextFocusForwardId(nextView.getId());
          currentView.setAccessibilityTraversalBefore(nextView.getId());
        }
      } catch (IllegalViewOperationException error) {
        Log.e("KEYBOARD_FOCUS_ERROR", error.getMessage());
      }
    });

  }

  public boolean isTalkBackEnabled() {
    boolean enable = false;
    final AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
    final List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_SPOKEN);
    for (AccessibilityServiceInfo serviceInfo : serviceList) {
      final String name = serviceInfo.getSettingsActivityName();
      if (!TextUtils.isEmpty(name) && name.equals(TALKBACK_SETTING_ACTIVITY_NAME)) {
        enable = true;
      }
    }
    return enable;
  }
}
