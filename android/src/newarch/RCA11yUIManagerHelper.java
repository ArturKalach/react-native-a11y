package com.reactnativea11y;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.common.ViewUtil;
import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;
import com.facebook.react.uimanager.UIManagerHelper;

public class RCA11yUIManagerHelper {
  public static UIManager getNativeModule(ReactApplicationContext context, int tag) {
    UIManager manager = null;

    int uiManagerType = ViewUtil.getUIManagerType(tag);
    if (uiManagerType == FABRIC) {
      manager = UIManagerHelper.getUIManager(context, uiManagerType);
    } else {
      manager = context.getNativeModule(UIManagerModule.class);
    }

    return manager;
  }
}
