package com.reactnativea11y.views.A11yView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.reactnativea11y.A11yViewManagerSpec;
import com.reactnativea11y.events.EventHelper;
import com.reactnativea11y.events.FocusChangeEvent;
import com.reactnativea11y.events.KeyPressDownEvent;
import com.reactnativea11y.events.KeyPressUpEvent;
import com.reactnativea11y.events.ScreenReaderDescendantFocusChangedEvent;
import com.reactnativea11y.events.ScreenReaderFocusChangedEvent;
import com.reactnativea11y.events.ScreenReaderFocusedEvent;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

/**
 * Manager for the merged native `A11yView` — the union of
 * react-native-external-keyboard's `ExternalKeyboardViewManager` and
 * react-native-a11y-order's `A11yIndexViewManager`.
 */
@ReactModule(name = A11yViewManager.NAME)
public class A11yViewManager extends A11yViewManagerSpec<A11yView> {

  public static final String NAME = "RCA11yView";

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  @NonNull
  @Override
  public A11yView createViewInstance(@NonNull ThemedReactContext context) {
    return new A11yView(context);
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    Map<String, Object> export = new HashMap<>();
    // keyboard
    export.put(FocusChangeEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onFocusChange"));
    export.put(KeyPressUpEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onKeyUpPress"));
    export.put(KeyPressDownEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onKeyDownPress"));
    // screen reader
    export.put(ScreenReaderFocusedEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onScreenReaderFocused"));
    export.put(ScreenReaderFocusChangedEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onScreenReaderFocusChange"));
    export.put(ScreenReaderDescendantFocusChangedEvent.EVENT_NAME, EventHelper.buildDirectEventMap("onScreenReaderDescendantFocusChanged"));
    return export;
  }

  // ─── Ordering: discriminator + shared index ─────────────────────────────────

  @Override
  @ReactProp(name = "orderType")
  public void setOrderType(A11yView view, int value) {
    view.setOrderType(value);
  }

  @Override
  @ReactProp(name = "orderIndex")
  public void setOrderIndex(A11yView view, int value) {
    // shared: feed both engines (each activates only when its key/group is present)
    if (!Objects.equals(view.getOrderIndex(), value)) {
      view.setOrderIndex(value); // keyboard (ViewOrderGroupBase)
    }
    view.setScreenReaderIndex(value); // screen reader (guards -1)
  }

  @Override
  @ReactProp(name = "orderKey")
  public void setOrderKey(A11yView view, @Nullable String value) {
    view.setOrderKey(value);
  }

  @Override
  @ReactProp(name = "orderGroup")
  public void setOrderGroup(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.getOrderGroup(), value)) {
      view.setOrderGroup(value);
    }
  }

  @Override
  @ReactProp(name = "focusTarget")
  public void setFocusTarget(A11yView view, int value) {
    view.setFocusTarget(value);
  }

  // ─── Screen-reader props (Android stubs mirror a11y-order) ──────────────────

  @Override
  public void setShouldGroupAccessibilityChildren(A11yView view, int value) {
    // stub (iOS only)
  }

  @Override
  public void setContainerType(A11yView view, int value) {
    // stub (iOS only)
  }

  @Override
  public void setDescendantFocusChangedEnabled(A11yView view, boolean value) {
    // stub — Android dispatches descendant events unconditionally
  }

  // ─── Keyboard focus props ───────────────────────────────────────────────────

  @Override
  @ReactProp(name = "canBeFocused", defaultBoolean = true)
  public void setCanBeFocused(A11yView view, boolean value) {
    view.setCanBeFocused(value);
  }

  @Override
  @ReactProp(name = "autoFocus")
  public void setAutoFocus(A11yView view, boolean value) {
    if (view.autoFocus != value) {
      view.autoFocus = value;
    }
  }

  @Override
  @ReactProp(name = "screenAutoA11yFocus", defaultBoolean = false)
  public void setScreenAutoA11yFocus(A11yView view, boolean value) {
    if (view.screenAutoA11yFocus != value) {
      view.screenAutoA11yFocus = value;
    }
  }

  @Override
  @ReactProp(name = "screenAutoA11yFocusDelay", defaultInt = 500)
  public void setScreenAutoA11yFocusDelay(A11yView view, int value) {
    if (view.screenAutoA11yFocusDelay != value) {
      view.screenAutoA11yFocusDelay = value;
    }
  }

  @Override
  @ReactProp(name = "hasKeyDownPress")
  public void setHasKeyDownPress(A11yView view, boolean value) {
    if (view.hasKeyDownListener != value) {
      view.hasKeyDownListener = value;
    }
  }

  @Override
  @ReactProp(name = "hasKeyUpPress")
  public void setHasKeyUpPress(A11yView view, boolean value) {
    if (view.hasKeyUpListener != value) {
      view.hasKeyUpListener = value;
    }
  }

  @Override
  public void setHasOnFocusChanged(A11yView view, boolean value) {
    // stub — Android attaches focus listeners unconditionally
  }

  @Override
  public void setEnableContextMenu(A11yView view, boolean value) {
    // stub (iOS only)
  }

  // ─── Keyboard styling (Android stubs; halo is iOS) ──────────────────────────

  @Override
  @ReactProp(name = "haloEffect", defaultBoolean = true)
  public void setHaloEffect(A11yView view, boolean value) {
    view.setFocusHighlight(value);
  }

  @Override
  @ReactProp(name = "haloCornerRadius")
  public void setHaloCornerRadius(A11yView view, float value) {
    // stub (iOS)
  }

  @Override
  @ReactProp(name = "haloExpendX")
  public void setHaloExpendX(A11yView view, float value) {
    // stub (iOS)
  }

  @Override
  @ReactProp(name = "haloExpendY")
  public void setHaloExpendY(A11yView view, float value) {
    // stub (iOS)
  }

  @Override
  @ReactProp(name = "roundedHaloFix")
  public void setRoundedHaloFix(A11yView view, boolean value) {
    // stub (iOS)
  }

  @Override
  public void setTintColor(A11yView view, @Nullable Integer value) {
    // stub (iOS)
  }

  @Override
  public void setGroupIdentifier(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  // ─── Optimistic accessibility values (iOS only) ─────────────────────────────

  @Override
  public void setOptimisticIncrease(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  @Override
  public void setOptimisticDecrease(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  @Override
  public void setOptimisticActivate(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  @Override
  public void setOptimisticState(A11yView view, int value) {
    // stub (iOS)
  }

  // ─── Keyboard directional lock + link order ─────────────────────────────────

  @Override
  @ReactProp(name = "lockFocus")
  public void setLockFocus(A11yView view, int value) {
    if (view.lockFocus != value) {
      view.lockFocus = value;
    }
  }

  @Override
  @ReactProp(name = "orderId")
  public void setOrderId(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.orderId, value)) {
      view.orderId = value;
    }
  }

  @Override
  @ReactProp(name = "orderLeft")
  public void setOrderLeft(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.getOrderLeft(), value)) {
      view.setOrderLeft(value);
    }
  }

  @Override
  @ReactProp(name = "orderRight")
  public void setOrderRight(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.getOrderRight(), value)) {
      view.setOrderRight(value);
    }
  }

  @Override
  @ReactProp(name = "orderUp")
  public void setOrderUp(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.getOrderUp(), value)) {
      view.setOrderUp(value);
    }
  }

  @Override
  @ReactProp(name = "orderDown")
  public void setOrderDown(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.getOrderDown(), value)) {
      view.setOrderDown(value);
    }
  }

  @Override
  @ReactProp(name = "orderForward")
  public void setOrderForward(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.orderForward, value)) {
      view.orderForward = value;
    }
  }

  @Override
  @ReactProp(name = "orderBackward")
  public void setOrderBackward(A11yView view, @Nullable String value) {
    if (!Objects.equals(view.orderBackward, value)) {
      view.orderBackward = value;
    }
  }

  @Override
  public void setOrderFirst(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  @Override
  public void setOrderLast(A11yView view, @Nullable String value) {
    // stub (iOS)
  }

  // ─── Commands (merged focus handle) ─────────────────────────────────────────

  @Override
  public void focus(A11yView view) {
    view.focusBoth();
  }

  @Override
  public void keyboardFocus(A11yView view) {
    view.keyboardFocus();
  }

  @Override
  public void screenReaderFocus(A11yView view) {
    view.screenReaderFocus();
  }

  @Override
  public void receiveCommand(ReactViewGroup root, String commandId, @Nullable ReadableArray args) {
    A11yView view = (A11yView) root;
    switch (commandId) {
      case "focus":
        view.focusBoth();
        break;
      case "keyboardFocus":
        view.keyboardFocus();
        break;
      case "screenReaderFocus":
        view.screenReaderFocus();
        break;
      default:
        super.receiveCommand(root, commandId, args);
    }
  }

  @Override
  public void onDropViewInstance(@NonNull ReactViewGroup viewGroup) {
    if (viewGroup instanceof A11yView) {
      ((A11yView) viewGroup).onDropViewInstance();
    }
    super.onDropViewInstance(viewGroup);
  }
}
