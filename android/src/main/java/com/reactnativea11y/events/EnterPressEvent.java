package com.reactnativea11y.events;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class EnterPressEvent extends Event<EnterPressEvent> {
  public WritableMap mExtraData;

  public static String EVENT_NAME = "topOnEnterPress";

  public EnterPressEvent(int id, WritableMap eventPayload) {
    super(id);
    this.mExtraData = eventPayload;
  }

  @Override
  public void dispatch(RCTEventEmitter rCTEventEmitter) {
    rCTEventEmitter.receiveEvent(this.getViewTag(), this.getEventName(), this.mExtraData);
  }

  @Override
  public short getCoalescingKey() {
    return 0;
  }

  @Override
  public boolean canCoalesce() {
    return false;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

}
