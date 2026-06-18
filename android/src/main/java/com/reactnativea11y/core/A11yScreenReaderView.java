package com.reactnativea11y.core;

import android.content.Context;
import android.view.View;
import android.view.accessibility.AccessibilityEvent;

import com.reactnativea11y.events.EventHelper;
import com.facebook.react.bridge.ReactContext;

/**
 * Screen-reader layer of the merged view. Re-parented (from react-native-a11y-order,
 * where it extended `A11yViewGroup`) onto the keyboard base chain
 * ({@link ViewKeyHandlerBase}) so the merged `A11yView` is a single linear hierarchy
 * carrying both screen-reader and keyboard behavior. Sub-child tracking reuses
 * {@code getFirstChild()} from {@link ViewOrderGroupBase}.
 */
public class A11yScreenReaderView extends ViewKeyHandlerBase {
  private final Context context;

  public A11yScreenReaderView(Context context) {
    super(context);
    this.context = context;
  }

  public static String getNativeIdSafe(View view) {
    try {
      Object tag = view.getTag(com.facebook.react.R.id.view_tag_native_id);
      return (tag instanceof String) ? (String) tag : null;
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public void onPopulateAccessibilityEvent(AccessibilityEvent event) {
    super.onPopulateAccessibilityEvent(event);
    int eventType = event.getEventType();
    if (eventType == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED) {
      EventHelper.screenReaderFocused((ReactContext) context, this.getId());
    }
  }

  @Override
  public boolean onRequestSendAccessibilityEvent(View child, AccessibilityEvent event) {
    int eventType = event.getEventType();
    boolean isSubChild = (child == this.getFirstChild());

    if (eventType == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED && isSubChild) {
      EventHelper.screenReaderFocusChanged((ReactContext) context, this.getId(), true);
    }

    if (eventType == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUS_CLEARED && isSubChild) {
      EventHelper.screenReaderFocusChanged((ReactContext) context, this.getId(), false);
    }

    if (eventType == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUS_CLEARED) {
      String nativeId = getNativeIdSafe(child);
      EventHelper.screenReaderDescendantFocusChanged((ReactContext) context, this.getId(), "blurred", nativeId);
    }

    if (eventType == AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED) {
      String nativeId = getNativeIdSafe(child);
      EventHelper.screenReaderDescendantFocusChanged((ReactContext) context, this.getId(), "focused", nativeId);
    }

    return super.onRequestSendAccessibilityEvent(child, event);
  }
}
