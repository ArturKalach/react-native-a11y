package com.reactnativea11y;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;

public class RCA11yUIManagerHelper {
  public static UIManagerModule getNativeModule(ReactApplicationContext context, int _stubForNewArchSupport) {
    return context.getNativeModule(UIManagerModule.class);
  }
}
