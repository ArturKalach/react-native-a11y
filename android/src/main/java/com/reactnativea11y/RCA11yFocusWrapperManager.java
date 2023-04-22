package com.reactnativea11y;

import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;


import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import java.util.Map;
import com.facebook.react.uimanager.UIManagerHelper;
import com.reactnativea11y.events.EnterPressEvent;
import com.reactnativea11y.events.FocusChangeEvent;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

public class RCA11yFocusWrapperManager extends com.reactnativea11y.RCA11yFocusWrapperManagerSpec<RCA11yFocusWrapper> {

  public static final String NAME = "RCA11yFocusWrapper";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public RCA11yFocusWrapper createViewInstance(ThemedReactContext context) {
    return new RCA11yFocusWrapper(context);
  }

  @Override
  protected void addEventEmitters(final ThemedReactContext reactContext, RCA11yFocusWrapper viewGroup) {
    viewGroup.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
      @Override
      public void onChildViewAdded(View parent, View child) {
        child.setOnFocusChangeListener(
          (v, hasFocus) -> {
            WritableMap eventPayload = Arguments.createMap();
            eventPayload.putBoolean("isFocused", hasFocus);
            FocusChangeEvent event = new FocusChangeEvent(viewGroup.getId(), eventPayload);
            UIManagerHelper.getEventDispatcherForReactTag((ReactContext) reactContext, v.getId()).dispatchEvent(event);
          });
        child.setOnKeyListener(new View.OnKeyListener() {
          @Override
          public boolean onKey(View v, int keyCode, KeyEvent keyEvent) {
            if (keyEvent.getAction() == KeyEvent.ACTION_DOWN) {
              switch (keyCode) {
                case KeyEvent.KEYCODE_ENTER:
                  WritableMap eventPayload = Arguments.createMap();
                  eventPayload.putBoolean("isEnterPress", true);
                  eventPayload.putBoolean("isAltPressed", keyEvent.isAltPressed());
                  eventPayload.putBoolean("isShiftPressed", keyEvent.isShiftPressed());
                  EnterPressEvent event = new EnterPressEvent(viewGroup.getId(), eventPayload);
                  UIManagerHelper.getEventDispatcherForReactTag((ReactContext) reactContext, v.getId()).dispatchEvent(event);
                  return false;
                default:
                  return false;
              }

            }
            return false;
          }
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
    // Default events but adding them here explicitly for clarity
    export.put(FocusChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFocusChange"));
    export.put(EnterPressEvent.EVENT_NAME, MapBuilder.of("registrationName", "onEnterPress"));
    return export;
  }

  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(RCA11yFocusWrapper wrapper, boolean canBeFocused) {
    wrapper.setDescendantFocusability(
      canBeFocused ?
        wrapper.FOCUS_AFTER_DESCENDANTS
        : wrapper.FOCUS_BLOCK_DESCENDANTS
    );
  }
}
