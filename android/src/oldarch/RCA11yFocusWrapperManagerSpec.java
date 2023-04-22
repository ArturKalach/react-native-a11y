package com.reactnativea11y;

import android.view.ViewGroup;
import com.facebook.react.uimanager.ViewGroupManager;

public abstract class RCA11yFocusWrapperManagerSpec<T extends ViewGroup> extends ViewGroupManager<T> {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);
}
