package com.reactnativea11y;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import android.view.View;

public class RCA11yUIManagerHelper {
  private ReactApplicationContext context;

  public RCA11yUIManagerHelper (ReactApplicationContext context) {
    this.context = context;
  }

  public View resolveView(int tag) {
    UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
    return uiManager.resolveView(tag);
  }
}
