package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class A11yLockManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setComponentType(T view, int value);
  public abstract void setContainerKey(T view, @Nullable String value);
  public abstract void setLockDisabled(T view, boolean value);
  public abstract void setForceLock(T view, boolean value);
}
