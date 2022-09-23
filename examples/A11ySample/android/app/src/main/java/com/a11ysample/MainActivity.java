package com.a11ysample;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {
  private final String ON_CONFIGURATION_CHANGED = "onConfigurationChanged";
  private final String NEW_CONFIG = "newConfig";

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "A11ySample";
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent(ON_CONFIGURATION_CHANGED);
    intent.putExtra(NEW_CONFIG, newConfig);
    this.sendBroadcast(intent);
  }
}
