package com.reactnativea11y.views.A11yLockView;

import android.view.View;

import java.lang.ref.WeakReference;

/** Shared lock state — merges react-native-a11y-order's `A11yLockService` and
 *  react-native-external-keyboard's `LockService` (identical implementations). */
public class A11yLockService {
  private static A11yLockService instance;

  private WeakReference<View> viewRef;
  private WeakReference<View> keyboardViewRef;


  private A11yLockService() {
  }

  public static synchronized A11yLockService getInstance() {
    if (instance == null) {
      instance = new A11yLockService();
    }
    return instance;
  }

  public View getView() {
    return viewRef != null ? viewRef.get() : null;
  }

  public void setView(View view) {
    viewRef = new WeakReference<>(view);
  }

  public View getKeyboardView() {
    return keyboardViewRef != null ? keyboardViewRef.get() : null;
  }

  public void setKeyboardView(View view) {
    keyboardViewRef = new WeakReference<>(view);
  }

  public void clear() {
    this.viewRef = null;
    this.keyboardViewRef = null;
  }
}
