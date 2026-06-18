package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class A11yOrderManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setOrderKey(T view, @Nullable String value);
}
