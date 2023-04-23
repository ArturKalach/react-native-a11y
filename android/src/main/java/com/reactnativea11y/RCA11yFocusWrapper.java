package com.reactnativea11y;

import android.content.Context;
import android.util.AttributeSet;
import android.view.ViewGroup;
import androidx.annotation.Nullable;

public class RCA11yFocusWrapper extends ViewGroup {

  @Override
  protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
    // No-op since UIManagerModule handles actually laying out children.
  }

  public RCA11yFocusWrapper(Context context) {
    super(context);
  }

  public RCA11yFocusWrapper(Context context, @Nullable AttributeSet attrs) {
    super(context, attrs);
  }

  public RCA11yFocusWrapper(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
  }

}
