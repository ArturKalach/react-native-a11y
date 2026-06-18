package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class A11yFocusGroupManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setTintColor(T view, @Nullable Integer value);
  public abstract void setGroupIdentifier(T view, @Nullable String value);
  public abstract void setOrderGroup(T view, @Nullable String value);
}
