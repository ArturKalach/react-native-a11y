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

  private final ReactApplicationContext context;

  public A11yReader(ReactApplicationContext context) {
    this.context = context;
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

    final UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    final ArrayList<View> views = new ArrayList<>();
    for (int i = 0; i < length; i++) {
      try {
        views.add(uiManager.resolveView(reactTags.getInt(i)));
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
  }
}
