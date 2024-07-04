package com.reactnativea11y;

import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import com.reactnativea11y.components.RCA11yTextInputWrapper;

public abstract class RCA11yTextInputWrapperManagerSpec<T extends ReactViewGroup> extends ReactViewManager {
  public abstract void setCanBeFocused(T wrapper, boolean canBeFocused);

  public abstract void setFocusType(RCA11yTextInputWrapper view, int value);

  public abstract void setBlurType(RCA11yTextInputWrapper view, int value);
}
