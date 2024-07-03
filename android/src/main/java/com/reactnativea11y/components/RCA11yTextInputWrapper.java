package com.reactnativea11y.components;


import android.content.Context;
import android.graphics.Rect;
import android.view.KeyEvent;
import android.view.View;

import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.view.ReactViewGroup;

public class RCA11yTextInputWrapper extends ReactViewGroup {

  public static final byte FOCUS_BY_PRESS = 1;
  private ReactEditText reactEditText = null;

  private int focusType = 0;

  public RCA11yTextInputWrapper(Context context) {
    super(context);
  }

  public void setEditText(ReactEditText editText) {
    if (editText != null) {
      this.reactEditText = editText;
    } else {
      this.reactEditText.setOnFocusChangeListener(null);
    }
  }

  public void setFocusType(int focusType) {
    this.focusType = focusType;
  }

  public void setBlurType(int blurType) {
    // Stub, Android does not allow to type in EditField from another view. Even focus remains typing with soft or hard keyboard won't work
  }


  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (focusType == FOCUS_BY_PRESS && keyCode == KeyEvent.KEYCODE_SPACE) {
      this.handleTextInputFocus();
    }
    return super.onKeyDown(keyCode, event);
  }

  @Override
  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    if ((direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) && focusType != FOCUS_BY_PRESS) {
      this.handleTextInputFocus();
      return true;
    }

    return super.requestFocus(direction, previouslyFocusedRect);
  }

  private void handleTextInputFocus() {
    this.reactEditText.requestFocusFromJS();
    this.setFocusable(false);

    this.reactEditText.setOnFocusChangeListener((textInput, hasTextEditFocus) -> {
      if (!hasTextEditFocus) {
        this.setFocusable(true);
        this.reactEditText.setFocusable(false);
      }
    });
  }
}
