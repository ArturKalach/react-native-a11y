package com.reactnativea11y.utils;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityManager;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.view.ViewCompat;

public class A11yHelper {

  public static boolean isAccessible(@Nullable View view) {
    return view != null && ViewCompat.isImportantForAccessibility(view);
  }

  public static boolean isFocused(@Nullable View view) {
    return view != null && view.isAccessibilityFocused();
  }

  public static void focus(@Nullable View view) {
    if (view == null || isFocused(view)) return;
    ChoreographerUtils.run(() -> {
      if (!isFocused(view)) {
        view.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED);
      }
    });
  }

  public static boolean isA11yServiceEnabled(@NonNull Context context) {
    AccessibilityManager accessibilityManager =
      (AccessibilityManager) context.getSystemService(Context.ACCESSIBILITY_SERVICE);
    return accessibilityManager != null
      && accessibilityManager.isEnabled()
      && accessibilityManager.isTouchExplorationEnabled();
  }

  public static View findFirstAccessible(@Nullable ViewGroup viewGroup) {
    return findFirstAccessible(viewGroup, false);
  }

  public static View findFirstAccessible(@Nullable ViewGroup viewGroup, boolean ignoreRoot) {
    if (viewGroup == null) return null;

    if (!ignoreRoot && isAccessible(viewGroup)) return viewGroup;

    for (int i = 0; i < viewGroup.getChildCount(); i++) {
      View child = viewGroup.getChildAt(i);
      if (isAccessible(child)) return child;

      if (child instanceof ViewGroup) {
        View accessibleChild = findFirstAccessible((ViewGroup) child, true);
        if (accessibleChild != null) return accessibleChild;
      }
    }

    return null;
  }

  public static View findFirstFocusable(@Nullable ViewGroup viewGroup) {
    return findFirstFocusable(viewGroup, false);
  }

  private static View findFirstFocusable(@Nullable ViewGroup viewGroup, boolean ignoreRoot) {
    if (viewGroup == null) return null;

    if (!ignoreRoot && isKeyboardFocusable(viewGroup)) return viewGroup;

    for (int i = 0; i < viewGroup.getChildCount(); i++) {
      View child = viewGroup.getChildAt(i);
      if (isKeyboardFocusable(child)) return child;

      if (child instanceof ViewGroup) {
        View focusableChild = findFirstFocusable((ViewGroup) child, true);
        if (focusableChild != null) return focusableChild;
      }
    }

    return null;
  }

  private static boolean isKeyboardFocusable(@NonNull View view) {
    return view.isFocusable() && view.getVisibility() == View.VISIBLE && view.isEnabled();
  }
}
