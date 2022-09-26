package com.reactnativea11y;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativea11y.components.RCA11yFocusWrapperManager;
import com.reactnativea11y.components.RCA11yPaneViewManager;
import com.reactnativea11y.modules.RCA11yModule;

import java.util.Arrays;
import java.util.List;

public class A11yPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    return Arrays.asList(new RCA11yModule(reactContext));
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Arrays.asList(new RCA11yFocusWrapperManager(), new RCA11yPaneViewManager());
  }
}
