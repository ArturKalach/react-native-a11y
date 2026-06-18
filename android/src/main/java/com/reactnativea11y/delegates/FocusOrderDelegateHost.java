package com.reactnativea11y.delegates;

import android.view.View;

public interface FocusOrderDelegateHost {
  View getFirstChild();
  String getOrderGroup();
  Integer getOrderIndex();
  String getOrderId();
  String getOrderLeft();
  String getOrderRight();
  String getOrderUp();
  String getOrderDown();
}
