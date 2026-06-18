package com.reactnativea11y.views.A11yFocusGroup;

import androidx.annotation.Nullable;

import com.reactnativea11y.A11yFocusGroupManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

@ReactModule(name = A11yFocusGroupManager.NAME)
public class A11yFocusGroupManager extends A11yFocusGroupManagerSpec<A11yFocusGroup> {
  public static final String NAME = "A11yFocusGroup";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public A11yFocusGroup createViewInstance(ThemedReactContext context) {
    return new A11yFocusGroup(context);
  }

  @Override
  public void setTintColor(A11yFocusGroup view, @Nullable Integer value) {
    // stub — iOS-only focus group
  }

  @Override
  @ReactProp(name = "groupIdentifier")
  public void setGroupIdentifier(A11yFocusGroup wrapper, @Nullable String groupIdentifier) {
    // stub — iOS-only focus group
  }

  @Override
  @ReactProp(name = "orderGroup")
  public void setOrderGroup(A11yFocusGroup view, @Nullable String value) {
    // stub — iOS-only focus group
  }
}
