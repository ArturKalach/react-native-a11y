package com.reactnativea11y.modules.services;


import android.accessibilityservice.AccessibilityServiceInfo;
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
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.ArrayList;
import java.util.List;

public class A11yReader {
  private static final String TALKBACK_SETTING_ACTIVITY_NAME = "com.android.talkback.TalkBackPreferencesActivity";

  private ReactApplicationContext context;

  public A11yReader(ReactApplicationContext context) {
    this.context = context;
    this.startListening();
  }

  private void startListening() {
    AccessibilityManager accessibilityManager = (AccessibilityManager) context
      .getSystemService(Context.ACCESSIBILITY_SERVICE);
    if (accessibilityManager != null) {
      accessibilityManager.addAccessibilityStateChangeListener(new AccessibilityManager.AccessibilityStateChangeListener() {
        @Override
        public void onAccessibilityStateChanged(boolean b) {
          accessibilityChanged(b);
        }
      });
      accessibilityChanged(accessibilityManager.isEnabled());
    }
  }

  public void accessibilityChanged(Boolean isEnabled) {
    Log.i("A11y was changed", String.valueOf(isEnabled));
  }

  public void announceScreenChange(String screenName) {
    AccessibilityManager accessibilityManager = (AccessibilityManager) context
      .getSystemService(Context.ACCESSIBILITY_SERVICE);

    if (accessibilityManager == null || !accessibilityManager.isEnabled()) {
      return;
    }

    AccessibilityEvent event = AccessibilityEvent.obtain(AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED);
    event.getText().add(screenName);

    accessibilityManager.sendAccessibilityEvent(event);
  }


  @RequiresApi(api = Build.VERSION_CODES.N)
  public void setA11yOrder(@NonNull ReadableArray reactTags) {
    int length = reactTags.size();
    if (length < 2) return;

    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    ArrayList<View> views = new ArrayList<>();
    for (int i = 0; i < length; i++) {
      try {
        views.add(uiManager.resolveView(reactTags.getInt(i)));
      } catch (IllegalViewOperationException error) {
        Log.e("ERROR", error.getMessage());
      }
    }
    for (int i = 0; i < views.size() - 1; i++) {
      View currentView = views.get(i);
      View nextView = views.get(i + 1);
      currentView.setNextFocusForwardId(nextView.getId());
      currentView.setAccessibilityTraversalBefore(nextView.getId());
    }
  }

  public boolean isTalkBackEnabled() {
    boolean enable = false;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH) {
        AccessibilityManager manager = (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
        List<AccessibilityServiceInfo> serviceList = manager.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_SPOKEN);
        for (AccessibilityServiceInfo serviceInfo : serviceList) {
          String name = serviceInfo.getSettingsActivityName();
          if (!TextUtils.isEmpty(name) && name.equals(TALKBACK_SETTING_ACTIVITY_NAME)) {
            enable = true;
          }
        }
    }
    return enable;
  }
}
