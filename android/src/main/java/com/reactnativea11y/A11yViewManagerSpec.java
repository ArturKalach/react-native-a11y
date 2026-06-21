package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

/**
 * View-manager base for the merged `A11yView`. Extends `ReactViewManager` (not a
 * codegen-generated delegate) so `getDelegate()` keeps its default reflection path
 * — props are set via the manager's `@ReactProp` methods on both architectures.
 */
public abstract class A11yViewManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  // Ordering
  public abstract void setOrderType(T view, int value);
  public abstract void setOrderIndex(T view, int value);
  public abstract void setOrderKey(T view, @Nullable String value);
  public abstract void setOrderGroup(T view, @Nullable String value);
  public abstract void setFocusTarget(T view, int value);

  // Screen reader
  public abstract void setShouldGroupAccessibilityChildren(T view, int value);
  public abstract void setContainerType(T view, int value);
  public abstract void setDescendantFocusChangedEnabled(T view, boolean value);

  // Optimistic accessibility values (iOS only; stubbed on Android)
  public abstract void setOptimisticIncrease(T view, @Nullable String value);
  public abstract void setOptimisticDecrease(T view, @Nullable String value);
  public abstract void setOptimisticActivate(T view, @Nullable String value);
  public abstract void setOptimisticState(T view, int value);

  // Keyboard focus
  public abstract void setCanBeFocused(T view, boolean value);
  public abstract void setAutoFocus(T view, boolean value);
  public abstract void setScreenAutoA11yFocus(T view, boolean value);
  public abstract void setScreenAutoA11yFocusDelay(T view, int value);
  public abstract void setHasKeyDownPress(T view, boolean value);
  public abstract void setHasKeyUpPress(T view, boolean value);
  public abstract void setHasOnFocusChanged(T view, boolean value);
  public abstract void setEnableContextMenu(T view, boolean value);

  // Keyboard styling
  public abstract void setHaloEffect(T view, boolean value);
  public abstract void setHaloCornerRadius(T view, float value);
  public abstract void setHaloExpendX(T view, float value);
  public abstract void setHaloExpendY(T view, float value);
  public abstract void setRoundedHaloFix(T view, boolean value);
  public abstract void setTintColor(T view, @Nullable Integer value);
  public abstract void setGroupIdentifier(T view, @Nullable String value);

  // Keyboard lock + link order
  public abstract void setLockFocus(T view, int value);
  public abstract void setOrderId(T view, @Nullable String value);
  public abstract void setOrderLeft(T view, @Nullable String value);
  public abstract void setOrderRight(T view, @Nullable String value);
  public abstract void setOrderUp(T view, @Nullable String value);
  public abstract void setOrderDown(T view, @Nullable String value);
  public abstract void setOrderForward(T view, @Nullable String value);
  public abstract void setOrderBackward(T view, @Nullable String value);
  public abstract void setOrderFirst(T view, @Nullable String value);
  public abstract void setOrderLast(T view, @Nullable String value);

  // Commands
  public abstract void focus(T view);
  public abstract void keyboardFocus(T view);
  public abstract void screenReaderFocus(T view);
}
