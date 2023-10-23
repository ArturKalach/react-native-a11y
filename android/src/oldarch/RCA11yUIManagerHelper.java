package com.reactnativea11y;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.common.ViewUtil;
import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;
import com.facebook.react.uimanager.UIManagerHelper;
import android.view.View;

public class RCA11yUIManagerHelper {
  private ReactApplicationContext context;
  private UIManager manager;
  public RCA11yUIManagerHelper (ReactApplicationContext context) {
    this.context = context;
  }

  public View resolveView(int tag) {
    int uiManagerType = ViewUtil.getUIManagerType(tag);

    if(this.manager == null) {
      if (uiManagerType == FABRIC) {
        this.manager = UIManagerHelper.getUIManager(context, uiManagerType);
      } else {
        this.manager = context.getNativeModule(UIManagerModule.class);
      }
    }

    return this.manager.resolveView(tag);
  }
}
