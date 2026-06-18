package com.reactnativea11y.views.A11yView;

import android.content.Context;
import android.view.KeyEvent;
import android.view.View;

import com.reactnativea11y.core.A11yScreenReaderView;
import com.reactnativea11y.services.focus.A11yFocusDelegate;
import com.reactnativea11y.services.focus.A11yFocusProtocol;
import com.reactnativea11y.services.order.A11yOrderService;
import com.facebook.react.bridge.ReactContext;

/**
 * Merged native view backing `A11y.View` / `A11y.Index` / `A11y.Pressable`.
 *
 * Extends {@link A11yScreenReaderView} (which linearizes the screen-reader layer onto
 * the keyboard base chain) and adds: the keyboard key dispatch (from
 * react-native-external-keyboard's `ExternalKeyboardView`) and the screen-reader
 * order service + focus delegate (from react-native-a11y-order's `A11yViewOrder` /
 * `A11yManagedFocusView`). One `orderType` prop selects which ordering engine is fed.
 */
public class A11yView extends A11yScreenReaderView implements A11yFocusProtocol {
  public static final int ORDER_TYPE_AUTO = 0;
  public static final int ORDER_TYPE_KEYBOARD = 1;
  public static final int ORDER_TYPE_SCREEN_READER = 2;

  private final A11yOrderService orderService;
  private final A11yFocusDelegate a11yFocusDelegate;
  private int orderType = ORDER_TYPE_AUTO;

  public A11yView(Context context) {
    super(context);
    this.orderService = new A11yOrderService(this);
    this.a11yFocusDelegate = new A11yFocusDelegate((ReactContext) context, this);
  }

  // ─── Keyboard key dispatch (from ExternalKeyboardView) ──────────────────────

  @Override
  public boolean dispatchKeyEvent(KeyEvent keyEvent) {
    this.handleKeyPress(keyEvent);
    if (this.isFocusLocked(keyEvent)) {
      return true;
    }
    return super.dispatchKeyEvent(keyEvent);
  }

  // ─── A11yFocusProtocol ──────────────────────────────────────────────────────

  @Override
  public boolean isViewFocused() {
    View focusTarget = this.isFocusable() ? this : this.getFirstChild();
    if (focusTarget == null) return false;
    return focusTarget.isAccessibilityFocused();
  }

  // ─── Child lifecycle: drive both keyboard (super) and SR order service ──────

  @Override
  public void linkAddView(View child) {
    super.linkAddView(child);
    this.orderService.link(child);
  }

  @Override
  public void linkRemoveView(View child) {
    super.linkRemoveView(child);
    this.orderService.detach();
  }

  // ─── Screen-reader order props ──────────────────────────────────────────────

  public void setOrderType(int orderType) {
    this.orderType = orderType;
  }

  public int getOrderType() {
    return orderType;
  }

  public void setOrderKey(String orderKey) {
    this.orderService.setOrderKey(orderKey);
  }

  /** Shared `orderIndex` for the screen-reader engine; -1 means unset. */
  public void setScreenReaderIndex(int index) {
    if (index == -1) return;
    this.orderService.setIndex(index);
  }

  /**
   * `focusTarget` (0 self / 1 child / 2 subview). Drives the screen-reader focus
   * target and the keyboard transparent-wrapper behavior (self ⇒ not a wrapper).
   */
  public void setFocusTarget(int focusTarget) {
    this.orderService.setFocusType(focusTarget);
    this.setFocusableWrapper(focusTarget != 0);
  }

  // ─── Focus commands ─────────────────────────────────────────────────────────

  public void keyboardFocus() {
    this.focus(true, false);
  }

  public void screenReaderFocus() {
    this.a11yFocusDelegate.requestFocus();
  }

  public void focusBoth() {
    this.focus(true, false);
    this.a11yFocusDelegate.requestFocus();
  }
}
