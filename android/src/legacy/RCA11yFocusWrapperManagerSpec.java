package com.reactnativea11y;

import android.view.ViewGroup;
import com.facebook.react.views.view.ReactViewManager;

public abstract class RCA11yFocusWrapperManagerSpec<T extends ViewGroup> extends ReactViewManager {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);
}
