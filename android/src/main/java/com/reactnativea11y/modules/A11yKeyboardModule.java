package com.reactnativea11y.modules;

import android.content.Context;
import android.view.View;
import android.view.inputmethod.InputMethodManager;

import com.reactnativea11y.A11yKeyboardModuleSpec;
import com.reactnativea11y.services.KeyboardService;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

import java.lang.ref.WeakReference;

public class A11yKeyboardModule extends A11yKeyboardModuleSpec {
  public static final String NAME = "RCA11yKeyboardModule";
  private static WeakReference<View> focusedViewRef = new WeakReference<>(null);

  private boolean dismiss() {
    View focusedView = focusedViewRef.get();
    if (focusedView == null) return false;
    try {
      InputMethodManager imm = (InputMethodManager) getReactApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      if (imm != null) {
        imm.hideSoftInputFromWindow(focusedView.getWindowToken(), 0);
        return true;
      }
    } catch (Exception ignored) {
    }

    return false;
  }

  public static void setFocusedTextInput(View _focusedView) {
    focusedViewRef = new WeakReference<>(_focusedView);
  }

  public A11yKeyboardModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  @ReactMethod
  public void dismissKeyboard(Promise promise) {
    boolean result = dismiss();
    promise.resolve(result);
  }

  @Override
  @ReactMethod
  public void setKeyboardFocus(double nativeTag) {
    if (nativeTag <= 0) return;
    new KeyboardService(getReactApplicationContext()).setKeyboardFocus((int) nativeTag);
  }

  @Override
  @ReactMethod
  public void setPreferredKeyboardFocus(double nativeTag) {
    // No-op on Android — parity with react-native-a11y@0.7.
  }
}
