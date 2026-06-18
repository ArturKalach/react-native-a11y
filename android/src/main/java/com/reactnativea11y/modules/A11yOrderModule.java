package com.reactnativea11y.modules;

import static com.facebook.react.uimanager.common.UIManagerType.FABRIC;

import android.app.Activity;
import android.os.Build;
import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.common.ViewUtil;
import com.reactnativea11y.A11yOrderModuleSpec;

import java.util.ArrayList;

/**
 * Imperative order module — faithful port of the legacy 0.7 `A11yReader.setA11yOrder`.
 * Resolves the ordered child view tags and chains them with `setNextFocusForwardId`
 * (keyboard) + `setAccessibilityTraversalBefore` (TalkBack). The `containerTag` is
 * accepted for signature parity with iOS but unused on Android (the legacy impl
 * ignored it too).
 */
public class A11yOrderModule extends A11yOrderModuleSpec {
  public static final String NAME = "A11yOrderModule";

  public A11yOrderModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  private View resolveView(int tag) {
    int uiManagerType = ViewUtil.getUIManagerType(tag);
    if (uiManagerType == FABRIC) {
      UIManager fabricUIManager = UIManagerHelper.getUIManager(getReactApplicationContext(), uiManagerType);
      return fabricUIManager != null ? fabricUIManager.resolveView(tag) : null;
    }
    UIManager uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    return uiManager != null ? uiManager.resolveView(tag) : null;
  }

  @Override
  @ReactMethod
  public void setA11yOrder(ReadableArray viewTags, double containerTag) {
    if (viewTags == null || viewTags.size() < 2) return;
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) return;

    final ReadableArray tags = viewTags;
    final Activity activity = getReactApplicationContext().getCurrentActivity();
    if (activity == null) return;

    activity.runOnUiThread(() -> {
      try {
        final ArrayList<View> views = new ArrayList<>();
        for (int i = 0; i < tags.size(); i++) {
          try {
            View view = resolveView(tags.getInt(i));
            if (view != null) {
              views.add(view);
            }
          } catch (IllegalViewOperationException error) {
            Log.e("A11yOrderModule", String.valueOf(error.getMessage()));
          }
        }
        for (int i = 0; i < views.size() - 1; i++) {
          final View currentView = views.get(i);
          final View nextView = views.get(i + 1);
          if (nextView != null) {
            currentView.setNextFocusForwardId(nextView.getId());
            currentView.setAccessibilityTraversalBefore(nextView.getId());
          }
        }
      } catch (Exception e) {
        Log.e("A11yOrderModule", String.valueOf(e.getMessage()));
      }
    });
  }
}
