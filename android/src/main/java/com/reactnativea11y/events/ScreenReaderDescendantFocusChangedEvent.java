package com.reactnativea11y.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class ScreenReaderDescendantFocusChangedEvent extends Event<ScreenReaderDescendantFocusChangedEvent> {
  public static String EVENT_NAME = "topScreenReaderDescendantFocusChanged";
  public WritableMap payload;

  public ScreenReaderDescendantFocusChangedEvent(int surfaceId, int id, String status, String nativeId) {
    super(surfaceId, id);
    payload = Arguments.createMap();
    payload.putString("status", status);
    payload.putString("nativeId", nativeId);
  }

  public boolean canCoalesce() {
    return false;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public WritableMap getEventData() {
    return payload;
  }
}
