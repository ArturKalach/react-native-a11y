package com.reactnativea11y.utils;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.lifecycle.DefaultLifecycleObserver;
import androidx.lifecycle.LifecycleOwner;

public class FragmentUtils {

  public static void waitForFragmentResume(@NonNull Fragment fragment, @NonNull Runnable onReady) {
    fragment.getLifecycle().addObserver(new DefaultLifecycleObserver() {
      @Override
      public void onResume(@NonNull LifecycleOwner owner) {
        owner.getLifecycle().removeObserver(this);
        onReady.run();
      }
    });
  }

  @Nullable
  public static Fragment findFragmentSafely(View view) {
    try {
      return FragmentManager.findFragment(view);
    } catch (Exception ignored) {
      return null;
    }
  }
}
