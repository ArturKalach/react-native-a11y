package com.reactnativea11y;

import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.util.Map;
import com.facebook.react.uimanager.UIManagerHelper;
import com.reactnativea11y.events.FocusChangeEvent;
import com.reactnativea11y.events.KeyPressDownEvent;
import com.reactnativea11y.events.KeyPressUpEvent;
import com.reactnativea11y.services.KeyboardKeyPressHandler;

public class RCA11yFocusWrapperManager extends com.reactnativea11y.RCA11yFocusWrapperManagerSpec<RCA11yFocusWrapper> {

  public static final String NAME = "RCA11yFocusWrapper";
  private KeyboardKeyPressHandler keyboardKeyPressHandler;

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public RCA11yFocusWrapper createViewInstance(ThemedReactContext context) {
    this.keyboardKeyPressHandler = new KeyboardKeyPressHandler();
    return new RCA11yFocusWrapper(context);
  }


  private void onKeyPressHandler(RCA11yFocusWrapper viewGroup, int keyCode, KeyEvent keyEvent, ThemedReactContext reactContext) {
    KeyboardKeyPressHandler.PressInfo pressInfo = keyboardKeyPressHandler.getEventsFromKeyPress(keyCode,keyEvent);

    if(pressInfo.firePressDownEvent) {
      KeyPressDownEvent keyPressDownEvent = new KeyPressDownEvent(viewGroup.getId(), keyCode, keyEvent);
      UIManagerHelper.getEventDispatcherForReactTag((ReactContext) reactContext, viewGroup.getId()).dispatchEvent(keyPressDownEvent);
    }

    if(pressInfo.firePressUpEvent) {
      KeyPressUpEvent keyPressUpEvent = new KeyPressUpEvent(viewGroup.getId(), keyCode, keyEvent, pressInfo.isLongPress);
      UIManagerHelper.getEventDispatcherForReactTag((ReactContext) reactContext, viewGroup.getId()).dispatchEvent(keyPressUpEvent);
    }

  }

  @Override
  protected void addEventEmitters(final ThemedReactContext reactContext, RCA11yFocusWrapper viewGroup) {
    viewGroup.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
      @Override
      public void onChildViewAdded(View parent, View child) {
        child.setOnFocusChangeListener(
          (v, hasFocus) -> {
            FocusChangeEvent event = new FocusChangeEvent(viewGroup.getId(), hasFocus);
            UIManagerHelper.getEventDispatcherForReactTag((ReactContext) reactContext, v.getId()).dispatchEvent(event);
          });

        child.setOnKeyListener((View v, int keyCode, KeyEvent keyEvent) -> {
          onKeyPressHandler(viewGroup, keyCode, keyEvent, reactContext);
          return false;
        });
      }

      @Override
      public void onChildViewRemoved(View parent, View child) {
      }
    });
  }



  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = MapBuilder.<String, Object>builder().build();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }

    export.put(FocusChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFocusChange"));
    export.put(KeyPressUpEvent.EVENT_NAME, MapBuilder.of("registrationName", "onKeyUpPress"));
    export.put(KeyPressDownEvent.EVENT_NAME, MapBuilder.of("registrationName", "onKeyDownPress"));

    return export;
  }

  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(RCA11yFocusWrapper wrapper, boolean canBeFocused) {
    wrapper.setClickable(canBeFocused);
    wrapper.setFocusable(canBeFocused);
    wrapper.setDescendantFocusability(
      canBeFocused ?
        wrapper.FOCUS_AFTER_DESCENDANTS
        : wrapper.FOCUS_BLOCK_DESCENDANTS
    );
  }
}
