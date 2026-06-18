package com.reactnativea11y.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

public class ScreenReaderFocusChangedEvent extends Event<ScreenReaderFocusChangedEvent> {
  public static String EVENT_NAME = "topScreenReaderFocusChange";
  public WritableMap payload;

  public ScreenReaderFocusChangedEvent(int surfaceId, int id, Boolean hasFocus) {
    super(surfaceId, id);
    payload = Arguments.createMap();
    payload.putBoolean("isFocused", hasFocus);
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
