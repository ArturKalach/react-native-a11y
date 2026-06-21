package com.reactnativea11y.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class ScreenReaderFocusedEvent extends Event<ScreenReaderFocusedEvent> {
  public static String EVENT_NAME = "topScreenReaderFocused";
  public WritableMap payload;

  public ScreenReaderFocusedEvent(int surfaceId, int id) {
    super(surfaceId, id);
    payload = Arguments.createMap();
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
