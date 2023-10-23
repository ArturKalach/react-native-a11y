package com.reactnativea11y.events;

import android.view.KeyEvent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class KeyPressUpEvent extends Event<KeyPressUpEvent> {
  public WritableMap mExtraData;

  public static String EVENT_NAME = "topOnKeyUpPress";

  public KeyPressUpEvent(int id, int keyCode, KeyEvent keyEvent, boolean isLongPress) {
    super(id);

    WritableMap eventPayload = Arguments.createMap();
    eventPayload.putInt("keyCode", keyCode);
    eventPayload.putBoolean("isLongPress", isLongPress);
    eventPayload.putBoolean("isAltPressed", keyEvent.isAltPressed());
    eventPayload.putBoolean("isShiftPressed", keyEvent.isShiftPressed());
    eventPayload.putBoolean("isCtrlPressed", keyEvent.isCtrlPressed());
    eventPayload.putBoolean("isCapsLockOn", keyEvent.isCapsLockOn());
    eventPayload.putBoolean("hasNoModifiers", keyEvent.hasNoModifiers());

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
