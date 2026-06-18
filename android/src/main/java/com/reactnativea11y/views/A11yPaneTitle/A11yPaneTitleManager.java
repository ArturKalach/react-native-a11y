package com.reactnativea11y.views.A11yPaneTitle;

import androidx.annotation.Nullable;

import com.reactnativea11y.A11yPaneTitleManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = A11yPaneTitleManager.NAME)
public class A11yPaneTitleManager extends A11yPaneTitleManagerSpec<A11yPaneTitle> {
  public static final String NAME = "A11yPaneTitle";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public A11yPaneTitle createViewInstance(ThemedReactContext context) {
    return new A11yPaneTitle(context);
  }

  @Override
  @ReactProp(name = "title")
  public void setTitle(A11yPaneTitle view, @Nullable String value) {
    view.setTitle(value);
  }

  @Override
  @ReactProp(name = "detachMessage")
  public void setDetachMessage(A11yPaneTitle view, @Nullable String value) {
    view.setDetachMessage(value);
  }

  @Override
  @ReactProp(name = "type")
  public void setType(A11yPaneTitle view, int value) {
    view.setType(value);
  }

  @Override
  @ReactProp(name = "withFocusRestore")
  public void setWithFocusRestore(A11yPaneTitle view, boolean withFocusRestore) {
    // to-do
  }
}
