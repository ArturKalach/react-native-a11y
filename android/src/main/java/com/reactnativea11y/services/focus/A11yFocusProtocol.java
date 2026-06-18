package com.reactnativea11y.services.focus;

import android.view.ViewManager;
import android.view.ViewParent;

public interface A11yFocusProtocol extends ViewParent, ViewManager {
  public boolean isViewFocused();
}
