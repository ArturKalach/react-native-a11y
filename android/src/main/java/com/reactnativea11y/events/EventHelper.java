package com.reactnativea11y.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;

import java.util.HashMap;
import java.util.Map;

/**
 * Merged event dispatcher — unites react-native-a11y-order's screen-reader events
 * and react-native-external-keyboard's keyboard/key events. Dispatch goes through
 * `UIManagerHelper.getEventDispatcherForReactTag` (works on both architectures).
 */
public class EventHelper {
  private static void dispatch(ReactContext context, int id, Event<?> event) {
    EventDispatcher eventDispatcher =
      UIManagerHelper.getEventDispatcherForReactTag(context, id);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(event);
    }
  }

  // ─── Screen reader ─────────────────────────────────────────────────────────

  public static void screenReaderFocusChanged(ReactContext context, int id, boolean hasFocus) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new ScreenReaderFocusChangedEvent(surfaceId, id, hasFocus));
  }

  public static void screenReaderFocused(ReactContext context, int id) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new ScreenReaderFocusedEvent(surfaceId, id));
  }

  public static void screenReaderDescendantFocusChanged(ReactContext context, int id, String status, String nativeId) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new ScreenReaderDescendantFocusChangedEvent(surfaceId, id, status, nativeId));
  }

  // ─── Keyboard ──────────────────────────────────────────────────────────────

  public static void focusChanged(ReactContext context, int id, boolean hasFocus) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new FocusChangeEvent(surfaceId, id, hasFocus));
  }

  public static void pressDown(ReactContext context, int id, int keyCode, KeyEvent keyEvent) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new KeyPressDownEvent(surfaceId, id, keyCode, keyEvent));
  }

  public static void pressUp(ReactContext context, int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new KeyPressUpEvent(surfaceId, id, keyCode, keyEvent, isLongPress));
  }

  public static void multiplyTextSubmit(ReactContext context, int id, String text) {
    int surfaceId = UIManagerHelper.getSurfaceId(context);
    dispatch(context, id, new MultiplyTextSubmit(surfaceId, id, text));
  }

  // ─── Misc ──────────────────────────────────────────────────────────────────

  public static Map<String, Object> buildDirectEventMap(String registrationName) {
    Map<String, Object> eventMap = new HashMap<>();
    eventMap.put("registrationName", registrationName);
    return eventMap;
  }
}
