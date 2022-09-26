package com.reactnativea11y.components;

import android.os.Build;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public class RCA11yPaneViewManager extends ReactViewManager {
  public static final String REACT_CLASS = "RCA11yPaneView";

  private static final String PANE_VIEW_STUB_TITLE = " ";

  @Override
  public ReactViewGroup createViewInstance(ThemedReactContext context) {
    final ReactViewGroup reactViewGroup = super.createViewInstance(context);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      reactViewGroup.setAccessibilityPaneTitle(PANE_VIEW_STUB_TITLE);
    }
    return reactViewGroup;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }
}
