package com.reactnativea11y.views.A11yPaneTitle;

import android.app.Activity;
import android.content.Context;
import android.os.Build;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.views.view.ReactViewGroup;

public class A11yPaneTitle extends ReactViewGroup {

  public static final int ACTIVITY_TYPE = 0;
  public static final int PANE_TYPE = 1;

  private String title;
  private Integer type;
  private String detachMessage;
  private final ReactContext context;

  public A11yPaneTitle(Context context) {
    super(context);
    this.context = (ReactContext) context;
  }

  public void setDetachMessage(String value) {
    this.detachMessage = value;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setType(Integer type) {
    this.type = type;
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();

    if (title == null) return;

    switch (type) {
      case ACTIVITY_TYPE:
        Activity activity = context.getCurrentActivity();
        if (activity != null) {
          activity.setTitle(title);
        }
        break;

      case PANE_TYPE:
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          this.setAccessibilityPaneTitle(title);
        } else {
          announceForAccessibility(title);
        }
        break;

      default:
        announceForAccessibility(title);
        break;
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (detachMessage == null) return;

    switch (type) {
      case ACTIVITY_TYPE:
        Activity activity = context.getCurrentActivity();
        if (activity != null) {
          activity.setTitle(detachMessage);
        }
        break;

      case PANE_TYPE:
        break;

      default:
        announceForAccessibility(title);
        break;
    }
  }
}
