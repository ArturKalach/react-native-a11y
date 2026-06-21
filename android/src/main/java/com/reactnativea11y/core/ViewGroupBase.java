package com.reactnativea11y.core;

import android.content.Context;
import android.view.View;

import com.reactnativea11y.utils.FocusHelper;
import com.facebook.react.views.view.ReactViewGroup;

public class ViewGroupBase extends ReactViewGroup {

  public ViewGroupBase(Context context) {
    super(context);
  }

  protected View getFocusingView() {
    View focusableView = FocusHelper.getFocusableView(this);
    return focusableView != null ? focusableView : this;
  }
}
