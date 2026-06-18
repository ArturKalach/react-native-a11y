package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class A11yTextInputWrapperManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setFocusType(T view, int value);
  public abstract void setBlurType(T view, int value);
  public abstract void setBlurOnSubmit(T view, boolean value);
  public abstract void setMultiline(T view, boolean value);
  public abstract void setGroupIdentifier(T view, @Nullable String value);
  public abstract void setOrderGroup(T view, @Nullable String value);
  public abstract void setOrderIndex(T view, int value);
  public abstract void setOrderId(T view, @Nullable String value);
  public abstract void setOrderLeft(T view, @Nullable String value);
  public abstract void setOrderRight(T view, @Nullable String value);
  public abstract void setOrderUp(T view, @Nullable String value);
  public abstract void setOrderDown(T view, @Nullable String value);
  public abstract void setOrderForward(T view, @Nullable String value);
  public abstract void setOrderBackward(T view, @Nullable String value);
  public abstract void setLockFocus(T view, int value);
  public abstract void setOrderFirst(T view, @Nullable String value);
  public abstract void setOrderLast(T view, @Nullable String value);
  public abstract void setCanBeFocused(T view, boolean value);
  public abstract void setHasOnFocusChanged(T view, boolean value);
  public abstract void setHaloEffect(T view, boolean value);
  public abstract void setTintColor(T view, @Nullable Integer value);
  public abstract void setHaloExpendY(T view, float value);
  public abstract void setHaloExpendX(T view, float value);
  public abstract void setHaloCornerRadius(T view, float value);
  public abstract void setRoundedHaloFix(T view, boolean value);
}
