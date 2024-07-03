package com.reactnativea11y.components;

import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;

import com.facebook.react.views.view.ReactViewGroup;
import com.reactnativea11y.events.FocusChangeEvent;

import java.util.Map;

@ReactModule(name = RCA11yTextInputWrapperManager.NAME)
public class RCA11yTextInputWrapperManager extends com.reactnativea11y.RCA11yTextInputWrapperManagerSpec<RCA11yTextInputWrapper> {

  public static final String NAME = "RCA11yTextInputWrapper";

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public RCA11yTextInputWrapper createViewInstance(ThemedReactContext context) {
    return subscribeOnHierarchy(new RCA11yTextInputWrapper(context));
  }

  @Override
  protected void addEventEmitters(final ThemedReactContext reactContext, ReactViewGroup viewGroup) {
    viewGroup.setFocusable(true);
    viewGroup.setOnFocusChangeListener(
      (v, hasFocus) -> {
        FocusChangeEvent event = new FocusChangeEvent(viewGroup.getId(), hasFocus);
        UIManagerHelper.getEventDispatcherForReactTag(reactContext, v.getId()).dispatchEvent(event);
      });
  }

  protected RCA11yTextInputWrapper subscribeOnHierarchy(RCA11yTextInputWrapper viewGroup) {
    viewGroup.setOnHierarchyChangeListener(new ViewGroup.OnHierarchyChangeListener() {
      @Override
      public void onChildViewAdded(View parent, View child) {
        if (child instanceof ReactEditText) {
          viewGroup.setEditText((ReactEditText) child);
        }
      }

      @Override
      public void onChildViewRemoved(View parent, View child) {
        if (child instanceof ReactEditText) {
          viewGroup.setEditText(null);
        }
      }
    });

    return viewGroup;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = MapBuilder.<String, Object>builder().build();
    if (export == null) {
      export = MapBuilder.newHashMap();
    }

    export.put(FocusChangeEvent.EVENT_NAME, MapBuilder.of("registrationName", "onFocusChange"));

    return export;
  }

  @Override
  @ReactProp(name = "focusType")
  public void setFocusType(RCA11yTextInputWrapper view, int value) {
    view.setFocusType(value);
  }

  @Override
  @ReactProp(name = "blurType")
  public void setBlurType(RCA11yTextInputWrapper view, int value) {
    view.setBlurType(value);
  }


  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(RCA11yTextInputWrapper view, boolean value) {
    view.setFocusable(value);
  }

  @Override
  public void onDropViewInstance(@NonNull ReactViewGroup viewGroup) {
    if (viewGroup instanceof RCA11yTextInputWrapper) {
      RCA11yTextInputWrapper wrapper = (RCA11yTextInputWrapper) viewGroup;
      wrapper.setEditText(null);
      wrapper.setOnFocusChangeListener(null);
    }
    super.onDropViewInstance(viewGroup);
  }
}
