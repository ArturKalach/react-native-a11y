package com.reactnativea11y.views.A11yOrderView;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;

public class A11yOrderView extends ReactViewGroup {
  public A11yOrderView(Context context) {
    super(context);
  }

  private String orderKey;

  public String getOrderKey() {
    return orderKey;
  }

  public void setOrderKey(String orderKey) {
    this.orderKey = orderKey;
  }
}
