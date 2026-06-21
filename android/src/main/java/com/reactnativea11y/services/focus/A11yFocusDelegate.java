package com.reactnativea11y.services.focus;

import android.content.Context;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

import com.reactnativea11y.utils.A11yHelper;
import com.reactnativea11y.utils.FragmentUtils;
import com.facebook.react.bridge.ReactContext;

public class A11yFocusDelegate {
  private final A11yFocusProtocol delegate;
  private final Context context;

  public A11yFocusDelegate(ReactContext context, A11yFocusProtocol delegate) {
    this.delegate = delegate;
    this.context = context;
  }

  private void focus() {
    A11yFocusService.getInstance().requestFocus((ViewGroup) delegate);
  }

  private void simpleFocus() {
    A11yFocusService.getInstance().simpleFocus((ViewGroup) delegate);
  }

  public void onFocused() {
    A11yFocusService.getInstance().onFocused((ViewGroup) delegate);
  }

  public void requestFocus() {
    if (!A11yHelper.isA11yServiceEnabled(context)) return;

    Fragment currentFragment = FragmentUtils.findFragmentSafely((ViewGroup) delegate);

    if (currentFragment == null) {
      focus();
      return;
    }

    if (currentFragment.isResumed()) {
      simpleFocus();
      return;
    }

    FragmentUtils.waitForFragmentResume(currentFragment, this::focus);
  }
}
