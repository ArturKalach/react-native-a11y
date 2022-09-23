package com.reactnativea11y.components;


import android.view.View;
import android.view.ViewGroup;
import android.view.KeyEvent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

import org.jetbrains.annotations.NotNull;

import java.util.Map;

public class RCA11yFocusWrapperManagerCopy extends ReactViewManager {
  public static final String REACT_CLASS = "RCA11yFocusWrapper";

  public static final String ON_ENTER_PRESSED = "onEnterPressed";
  public static final String ON_FOCUS_CHANGED = "onFocusChanged";

  public static final String IS_ENTER_PRESSED = "isEnterPressed";
  public static final String IS_ALT_PRESSED = "isAltPressed";
  public static final String IS_SHIFT_PRESSED = "isShiftPressed";

  public static final String IS_FOCUSED = "isFocused";

  private ThemedReactContext reactContext;

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  public ReactViewGroup createViewInstance(@NonNull ThemedReactContext reactContext) {
    ReactViewGroup wrapper = super.createViewInstance(reactContext);
    this.reactContext = reactContext;
    this.addEventEmitter(wrapper);
    return wrapper;
  }

  protected void addEventEmitter(@NotNull final ReactViewGroup wrapper) {
    wrapper.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
      @Override
      public void onChildViewAdded(View parent, View child) {
        child.setOnFocusChangeListener(
          (_v, hasFocus) -> onFocusChanged(hasFocus, child.getId())
        );

        child.setOnKeyListener(new View.OnKeyListener() {
          @Override
          public boolean onKey(View v, int keyCode, KeyEvent keyEvent) {
            return onKeyPressed(keyCode, keyEvent, child.getId());
          }
        });
      }

      @Override
      public void onChildViewRemoved(View parent, View child) {
      }
    });
  }

  private boolean onKeyPressed(int keyCode, KeyEvent keyEvent, int childId) {
    if (keyEvent.getAction() == KeyEvent.ACTION_DOWN && keyCode == KeyEvent.KEYCODE_ENTER) {
      WritableMap eventInfo = Arguments.createMap();
      eventInfo.putBoolean(IS_ENTER_PRESSED, true);
      eventInfo.putBoolean(IS_ALT_PRESSED, keyEvent.isAltPressed());
      eventInfo.putBoolean(IS_SHIFT_PRESSED, keyEvent.isShiftPressed());
      pushEvent(childId, eventInfo, ON_ENTER_PRESSED);
    }

    return false;
  }

  private void onFocusChanged(Boolean hasFocus, int id) {
    WritableMap eventInfo = Arguments.createMap();
    eventInfo.putBoolean(IS_FOCUSED, hasFocus);
    pushEvent(id, eventInfo, ON_FOCUS_CHANGED);
  }

  private void pushEvent(int id, WritableMap eventInfo, String eventName) {
    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
      id,
      eventName,
      eventInfo);
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put(
        ON_FOCUS_CHANGED,
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", ON_FOCUS_CHANGED)))
      .put(
        ON_ENTER_PRESSED,
        MapBuilder.of(
          "phasedRegistrationNames",
          MapBuilder.of("bubbled", ON_ENTER_PRESSED)))
      .build();
  }

  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(ReactViewGroup wrapper, boolean canBeFocused) {
    wrapper.setDescendantFocusability(
      canBeFocused ?
        ViewGroup.FOCUS_AFTER_DESCENDANTS
        : ViewGroup.FOCUS_BLOCK_DESCENDANTS
    );
  }
}
