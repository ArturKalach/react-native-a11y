package com.reactnativea11y.views.A11yLockView;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;

import com.reactnativea11y.utils.A11yHelper;
import com.facebook.react.views.view.ReactViewGroup;

/**
 * Merged lock view backing `A11y.FocusTrap` / `A11y.FocusFrame` — unites the
 * screen-reader lock (a11y-order `A11yLockView`) and the keyboard lock
 * (external-keyboard `ExternalKeyboardLockView`); identical logic plus `forceLock`.
 *
 * `componentType`: 0 = Trap (containment), 1 = Frame (leak detection).
 */
public class A11yLockView extends ReactViewGroup {
  private int componentType;
  private Boolean lockDisable = false;
  private Boolean forceLock = false;

  public A11yLockView(Context context) {
    super(context);
  }

  public static boolean isParentOf(ViewGroup parent, View child) {
    View current = child;
    while (current.getParent() instanceof View) {
      current = (View) current.getParent();
      if (current == parent) {
        return true;
      }
    }
    return false;
  }

  public void setComponentType(int value) {
    this.componentType = value;
  }

  public void setLockDisabled(boolean lockDisabled) {
    this.lockDisable = lockDisabled;
  }

  public void setForceLock(boolean forceLock) {
    this.forceLock = forceLock;
  }

  @Override
  public View focusSearch(View focused, int direction) {
    try {
      A11yLockService lockService = A11yLockService.getInstance();

      if (componentType == 1) {
        View keyboardView = lockService.getKeyboardView();
        if (keyboardView != null && keyboardView != focused) {
          return keyboardView;
        }
        return super.focusSearch(focused, direction);
      }

      if (componentType == 0) {
        View nextView = super.focusSearch(focused, direction);
        View result = isParentOf(this, nextView) ? nextView : focused;
        lockService.setKeyboardView(result);
        return result;
      }

      return super.focusSearch(focused, direction);
    } catch (Exception e) {
      return focused;
    }
  }

  @Override
  public boolean onRequestSendAccessibilityEvent(View child, AccessibilityEvent event) {
    // `forceLock` keeps the lock active even when `lockDisabled` is set
    // (programmatically-opened modals that must retain focus regardless).
    if (this.lockDisable && !this.forceLock) {
      return super.onRequestSendAccessibilityEvent(child, event);
    }

    if (event.getEventType() != AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED) {
      return super.onRequestSendAccessibilityEvent(child, event);
    }

    A11yLockService lockService = A11yLockService.getInstance();

    if (componentType == 0) {
      lockService.setView(child);
      return false;
    }

    if (componentType == 1) {
      View storedView = lockService.getView();
      if (storedView != null && storedView != child) {
        storedView.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
        return false;
      }
    }

    return super.onRequestSendAccessibilityEvent(child, event);
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    this.post(this::focusFirstAccessible);
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    A11yLockService.getInstance().clear();
  }

  private void focusFirstAccessible() {
    View firstAccessible = A11yHelper.findFirstAccessible(this);
    if (firstAccessible != null) {
      firstAccessible.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
    }

    View firstFocusable = A11yHelper.findFirstFocusable(this);
    if (firstFocusable != null) {
      firstFocusable.requestFocus();
    }
  }
}
