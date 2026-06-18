package com.reactnativea11y;

import com.reactnativea11y.modules.A11yAnnounceModule;
import com.reactnativea11y.modules.A11yKeyboardModule;
import com.reactnativea11y.modules.A11yKeyboardConnectedModule;
import com.reactnativea11y.modules.A11yOrderModule;
import com.reactnativea11y.views.A11yCardView.A11yCardViewManager;
import com.reactnativea11y.views.A11yFocusGroup.A11yFocusGroupManager;
import com.reactnativea11y.views.A11yLockView.A11yLockViewManager;
import com.reactnativea11y.views.A11yOrderView.A11yOrderViewManager;
import com.reactnativea11y.views.A11yPaneTitle.A11yPaneTitleManager;
import com.reactnativea11y.views.A11yTextInputWrapper.A11yTextInputWrapperManager;
import com.reactnativea11y.views.A11yView.A11yViewManager;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Single merged ReactPackage for react-native-a11y — registers the merged
 * `A11yView` + `A11yLock` and the single-purpose views/modules ported from
 * react-native-a11y-order and react-native-external-keyboard.
 */
public class A11yPackage extends TurboReactPackage {

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();
    viewManagers.add(new A11yViewManager());
    viewManagers.add(new A11yLockViewManager());
    viewManagers.add(new A11yOrderViewManager());
    viewManagers.add(new A11yCardViewManager());
    viewManagers.add(new A11yPaneTitleManager());
    viewManagers.add(new A11yFocusGroupManager());
    viewManagers.add(new A11yTextInputWrapperManager());
    return viewManagers;
  }

  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(A11yAnnounceModule.NAME)) {
      return new A11yAnnounceModule(reactContext);
    } else if (name.equals(A11yKeyboardModule.NAME)) {
      return new A11yKeyboardModule(reactContext);
    } else if (name.equals(A11yKeyboardConnectedModule.NAME)) {
      return new A11yKeyboardConnectedModule(reactContext);
    } else if (name.equals(A11yOrderModule.NAME)) {
      return new A11yOrderModule(reactContext);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> map = new HashMap<>();
      boolean isTurboModule = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

      map.put(A11yAnnounceModule.NAME, new ReactModuleInfo(
        A11yAnnounceModule.NAME, // name
        A11yAnnounceModule.NAME, // className
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      ));

      map.put(A11yKeyboardModule.NAME, new ReactModuleInfo(
        A11yKeyboardModule.NAME, // name
        A11yKeyboardModule.NAME, // className
        false, // canOverrideExistingModule
        false, // needsEagerInit
        true, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      ));

      map.put(A11yKeyboardConnectedModule.NAME, new ReactModuleInfo(
        A11yKeyboardConnectedModule.NAME, // name
        A11yKeyboardConnectedModule.NAME, // className
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      ));

      map.put(A11yOrderModule.NAME, new ReactModuleInfo(
        A11yOrderModule.NAME, // name
        A11yOrderModule.NAME, // className
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // hasConstants
        false, // isCxxModule
        isTurboModule // isTurboModule
      ));

      return map;
    };
  }
}
