package com.reactnativea11y.views.A11yLockView;

import androidx.annotation.Nullable;

import com.reactnativea11y.A11yLockManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = A11yLockViewManager.NAME)
public class A11yLockViewManager extends A11yLockManagerSpec<A11yLockView> {
  public static final String NAME = "A11yLock";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public A11yLockView createViewInstance(ThemedReactContext context) {
    return new A11yLockView(context);
  }

  @Override
  @ReactProp(name = "componentType")
  public void setComponentType(A11yLockView view, int value) {
    view.setComponentType(value);
  }

  @Override
  @ReactProp(name = "containerKey")
  public void setContainerKey(A11yLockView view, @Nullable String value) {
    // stub — not needed on Android
  }

  @Override
  @ReactProp(name = "lockDisabled")
  public void setLockDisabled(A11yLockView view, boolean value) {
    view.setLockDisabled(value);
  }

  @Override
  @ReactProp(name = "forceLock")
  public void setForceLock(A11yLockView view, boolean value) {
    view.setForceLock(value);
  }
}
