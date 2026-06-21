package com.reactnativea11y.views.A11yTextInputWrapper;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.Objects;

import com.reactnativea11y.A11yTextInputWrapperManagerSpec;
import com.reactnativea11y.events.FocusChangeEvent;
import com.reactnativea11y.events.MultiplyTextSubmit;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

import java.util.HashMap;
import java.util.Map;


@ReactModule(name = A11yTextInputWrapperManager.NAME)
public class A11yTextInputWrapperManager extends A11yTextInputWrapperManagerSpec<A11yTextInputWrapper> {
  public static final String NAME = "RCA11yTextInputWrapper";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public A11yTextInputWrapper createViewInstance(ThemedReactContext context) {
    return new A11yTextInputWrapper(context);
  }

  @Override
  protected void addEventEmitters(final ThemedReactContext reactContext, ReactViewGroup viewGroup) {
    if(viewGroup instanceof A11yTextInputWrapper) {
      ((A11yTextInputWrapper)viewGroup).subscribeOnFocus();
    }
  }

  @Override
  @ReactProp(name = "focusType")
  public void setFocusType(A11yTextInputWrapper view, int value) {
    view.setFocusType(value);
  }

  @Override
  @ReactProp(name = "blurType")
  public void setBlurType(A11yTextInputWrapper view, int value) {
    view.setBlurType(value);
  }

  @Override
  @ReactProp(name = "blurOnSubmit", defaultBoolean = true)
  public void setBlurOnSubmit(A11yTextInputWrapper view, boolean value) {
    view.setBlurOnSubmit(value);
  }

  @Override
  @ReactProp(name = "multiline")
  public void setMultiline(A11yTextInputWrapper view, boolean value) {
    view.setMultiline(value);
  }

  @Override
  public void setGroupIdentifier(A11yTextInputWrapper view, @Nullable String value) {
    //stub
  }

  @Override
  @ReactProp(name = "orderGroup")
  public void setOrderGroup(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderGroup(), value)) {
      view.setOrderGroup(value);
    }
  }

  @Override
  @ReactProp(name = "orderIndex")
  public void setOrderIndex(A11yTextInputWrapper view, int value) {
    if (!Objects.equals(view.getOrderIndex(), value)) {
      view.setOrderIndex(value);
    }
  }

  @Override
  @ReactProp(name = "orderId")
  public void setOrderId(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderId, value)) {
      view.orderId = value;
    }
  }

  @Override
  @ReactProp(name = "orderLeft")
  public void setOrderLeft(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderLeft(), value)) {
      view.setOrderLeft(value);
    }
  }

  @Override
  @ReactProp(name = "orderRight")
  public void setOrderRight(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderRight(), value)) {
      view.setOrderRight(value);
    }
  }

  @Override
  @ReactProp(name = "orderUp")
  public void setOrderUp(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderUp(), value)) {
      view.setOrderUp(value);
    }
  }

  @Override
  @ReactProp(name = "orderDown")
  public void setOrderDown(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.getOrderDown(), value)) {
      view.setOrderDown(value);
    }
  }

  @Override
  @ReactProp(name = "orderForward")
  public void setOrderForward(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderForward, value)) {
      view.orderForward = value;
    }
  }

  @Override
  @ReactProp(name = "orderBackward")
  public void setOrderBackward(A11yTextInputWrapper view, @Nullable String value) {
    if (!Objects.equals(view.orderBackward, value)) {
      view.orderBackward = value;
    }
  }

  @Override
  @ReactProp(name = "lockFocus")
  public void setLockFocus(A11yTextInputWrapper view, int value) {
    if (view.lockFocus != value) {
      view.lockFocus = value;
    }
  }

  @Override
  public void setOrderFirst(A11yTextInputWrapper view, @Nullable String value) {
    //stub
  }

  @Override
  public void setOrderLast(A11yTextInputWrapper view, @Nullable String value) {
    //stub
  }


  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(A11yTextInputWrapper view, boolean value) {
    view.setKeyboardFocusable(value);
  }

  @Override
  public void setHasOnFocusChanged(A11yTextInputWrapper view, boolean value) {
    //stub - Android attaches focus listeners unconditionally
  }

  @Override
  @ReactProp(name = "haloEffect", defaultBoolean = true)
  public void setHaloEffect(A11yTextInputWrapper view, boolean value) {
    view.setFocusHighlight(value);
  }

  @Override
  public void setTintColor(A11yTextInputWrapper view, @Nullable Integer value) {
    //stub
  }

  @Override
  public void onDropViewInstance(@NonNull ReactViewGroup viewGroup) {
    if(viewGroup instanceof A11yTextInputWrapper) {
      ((A11yTextInputWrapper)viewGroup).onDropViewInstance();
      ((A11yTextInputWrapper)viewGroup).setEditText(null);
      viewGroup.setOnFocusChangeListener(null);
    }
    super.onDropViewInstance(viewGroup);
  }

  private Map<String, Object> createEventMap(String registrationName) {
    Map<String, Object> eventMap = new HashMap<>();
    eventMap.put("registrationName", registrationName);
    return eventMap;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = new HashMap<>();

    export.put(FocusChangeEvent.EVENT_NAME, createEventMap("onFocusChange"));
    export.put(MultiplyTextSubmit.EVENT_NAME, createEventMap("onMultiplyTextSubmit"));

    return export;
  }

  @Override
  @ReactProp(name = "haloExpendY")
  public void setHaloExpendY(A11yTextInputWrapper view, float value) {

  }

  @Override
  @ReactProp(name = "haloExpendX")
  public void setHaloExpendX(A11yTextInputWrapper view, float value) {

  }

  @Override
  @ReactProp(name = "haloCornerRadius")
  public void setHaloCornerRadius(A11yTextInputWrapper view, float value) {

  }

  @Override
  @ReactProp(name = "roundedHaloFix")
  public void setRoundedHaloFix(A11yTextInputWrapper view, boolean value) {

  }
}
