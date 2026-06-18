package com.reactnativea11y;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;

public abstract class A11yAnnounceModuleSpec extends ReactContextBaseJavaModule {
  protected A11yAnnounceModuleSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract void announce(String message, @Nullable ReadableMap options, Promise promise);

  public abstract void cancel(String id, Promise promise);

  public abstract void cancelAll(Promise promise);
}
