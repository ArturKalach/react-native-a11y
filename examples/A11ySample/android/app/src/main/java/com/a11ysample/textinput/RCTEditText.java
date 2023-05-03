package com.a11ysample.textinput;

import android.content.Context;
import android.graphics.Rect;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;

import com.facebook.react.views.textinput.ReactEditText;

public class RCTEditText extends ReactEditText {
  static final int ENTER_KEY_CODE = KeyEvent.KEYCODE_ENTER;
  static final int MULTILINE_TYPE = EditorInfo.TYPE_TEXT_FLAG_MULTI_LINE;

  public RCTEditText(Context context) {
    super(context);
  }

  private boolean isKeyHandled(int keyCode) {
    boolean isMultiline = (this.getInputType() & MULTILINE_TYPE) == 0;
    return keyCode != ENTER_KEY_CODE
      || !isMultiline
      || !this.getBlurOnSubmit();
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (this.isKeyHandled(keyCode)) {
      return super.onKeyDown(keyCode, event);
    }
    return false;
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    if (this.isKeyHandled(keyCode)) {
      return super.onKeyUp(keyCode, event);
    }
    return false;
  }

  @Override
  public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
    if (direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) {
      this.requestFocusFromJS();
    }
    return super.requestFocus(direction, previouslyFocusedRect);
  }
}
