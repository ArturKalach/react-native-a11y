package com.reactnativea11y.core;

import android.content.Context;
import android.view.View;

import com.reactnativea11y.events.EventHelper;
import com.facebook.react.bridge.ReactContext;

public class ViewFocusChangeBase extends FocusableBase {
  private View listeningView;
  private final Context context;

  public ViewFocusChangeBase(Context context) {
    super(context);
    this.context = context;
  }


  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    bindFocusListener();
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    if (this.listeningView != null) {
      this.listeningView.setOnFocusChangeListener(null);
      this.listeningView = null;
    }
  }

  // The view that actually receives keyboard focus depends on focusability: when the
  // container is a non-focusable wrapper it is the first focusable child, otherwise the
  // container itself. `getFocusingView()` resolves that, but the answer changes when
  // `canBeFocused` / `focusableWrapper` toggle at runtime — e.g. a control that mounts
  // with `focusable={false}` and is later enabled (`getFocusableView` skips non-focusable
  // children, so at mount the listener would bind to the container, then stay stale once
  // the child becomes focusable and silently drop `onFocusChange`). syncFocusable is the
  // single hook every focusability change funnels through, so re-bind here.
  @Override
  protected void syncFocusable() {
    super.syncFocusable();
    if (isAttachedToWindow()) {
      bindFocusListener();
    }
  }

  private void bindFocusListener() {
    View next = getFocusingView();
    if (next == this.listeningView) return;

    if (this.listeningView != null) {
      this.listeningView.setOnFocusChangeListener(null);
    }
    this.listeningView = next;
    if (next != null) {
      next.setOnFocusChangeListener((focusedView, hasFocus) ->
          EventHelper.focusChanged((ReactContext) context, this.getId(), hasFocus));
    }
  }
}
