package com.reactnativea11y;

import android.graphics.Color;
import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class A11yViewManager extends SimpleViewManager<View> {
    public static final String REACT_CLASS = "A11yView";

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public View createViewInstance(ThemedReactContext reactContext) {
        return new View(reactContext);
    }

    @ReactProp(name = "color")
    public void setColor(View view, String color) {
        view.setBackgroundColor(Color.parseColor(color));
    }
}
