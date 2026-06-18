package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class A11yPaneTitleManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setTitle(T view, @Nullable String value);
  public abstract void setDetachMessage(T view, @Nullable String value);
  public abstract void setType(T view, int value);
  public abstract void setWithFocusRestore(T view, boolean value);
}
