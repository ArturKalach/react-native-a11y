package com.reactnativea11y;

import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.viewmanagers.RCA11yFocusWrapperManagerDelegate;
import com.facebook.react.viewmanagers.RCA11yFocusWrapperManagerInterface;
import com.facebook.soloader.SoLoader;
import com.facebook.react.uimanager.ViewGroupManager;


public abstract class RCA11yFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> implements RCA11yFocusWrapperManagerInterface<T> {
  static {
    if (BuildConfig.CODEGEN_MODULE_REGISTRATION != null) {
      SoLoader.loadLibrary(BuildConfig.CODEGEN_MODULE_REGISTRATION);
    }
  }

  private final ViewManagerDelegate<T> mDelegate;

  public RCA11yFocusWrapperManagerSpec() {
    mDelegate = new RCA11yFocusWrapperManagerDelegate(this);
  }

  @Nullable
  @Override
  protected ViewManagerDelegate<T> getDelegate() {
    return mDelegate;
  }
}
