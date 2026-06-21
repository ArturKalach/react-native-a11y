package com.reactnativea11y.views.A11yCardView;

import com.reactnativea11y.A11yCardManagerSpec;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.views.view.ReactViewGroup;

@ReactModule(name = A11yCardViewManager.NAME)
public class A11yCardViewManager extends A11yCardManagerSpec<ReactViewGroup> {
  public static final String NAME = "RCA11yCard";

  @Override
  public String getName() {
    return NAME;
  }
}
