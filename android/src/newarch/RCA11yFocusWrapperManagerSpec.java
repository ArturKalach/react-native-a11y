package com.reactnativea11y;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RCA11yFocusWrapperManagerDelegate;
import com.facebook.react.viewmanagers.RCA11yFocusWrapperManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.soloader.SoLoader;


public abstract class RCA11yFocusWrapperManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements RCA11yFocusWrapperManagerInterface<T> {
  static {
    if (BuildConfig.CODEGEN_MODULE_REGISTRATION != null) {
      SoLoader.loadLibrary(BuildConfig.CODEGEN_MODULE_REGISTRATION);
    }
  }
}
