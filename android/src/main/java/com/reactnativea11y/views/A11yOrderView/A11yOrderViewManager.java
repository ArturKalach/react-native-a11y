package com.reactnativea11y.views.A11yOrderView;

import androidx.annotation.Nullable;

import com.reactnativea11y.A11yOrderManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;

@ReactModule(name = A11yOrderViewManager.NAME)
public class A11yOrderViewManager extends A11yOrderManagerSpec<A11yOrderView> {

  public static final String NAME = "A11yOrder";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public A11yOrderView createViewInstance(ThemedReactContext context) {
    return new A11yOrderView(context);
  }

  @Override
  public void setOrderKey(A11yOrderView view, @Nullable String value) {
    view.setOrderKey(value);
  }
}
