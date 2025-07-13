package com.reactnativea11y;

import com.facebook.react.viewmanagers.RCA11yTextInputWrapperManagerInterface;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;
import com.facebook.soloader.SoLoader;
import com.reactnativea11y.BuildConfig;

public abstract class RCA11yTextInputWrapperManagerSpec<T extends ReactViewGroup> extends ReactViewManager implements RCA11yTextInputWrapperManagerInterface<T> {
}
