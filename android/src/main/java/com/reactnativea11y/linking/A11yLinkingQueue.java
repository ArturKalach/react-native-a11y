package com.reactnativea11y.linking;

import android.os.Build;
import android.view.View;

/**
 * Index-based order queue (from react-native-a11y-order). Links views by
 * `nextFocusForward` (keyboard) AND `accessibilityTraversalBefore` (screen
 * reader) — the unified queue used for both ordering systems.
 */
public class A11yLinkingQueue {
  private final WeakTreeMap viewMap = new WeakTreeMap();

  private void linkPosition(View prev, View next) {
    if (prev == null || next == null) return;
    prev.setNextFocusForwardId(next.getId());
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
      prev.setAccessibilityTraversalBefore(next.getId());
    }
  }

  private void clearForwardLink(View view) {
    if (view == null) return;
    view.setNextFocusForwardId(View.NO_ID);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
      view.setAccessibilityTraversalBefore(View.NO_ID);
    }
  }

  private void unlinkLast() {
    clearForwardLink(viewMap.last());
  }

  public void addPosition(View view, int position) {
    if (viewMap.get(position) == view) return;
    viewMap.put(position, view);
    View prev = viewMap.getPrev(position);
    View next = viewMap.getNext(position);
    if (prev != null) linkPosition(prev, view);
    if (next != null) linkPosition(view, next);
  }

  public void removeFromOrder(int position) {
    if (!viewMap.containsKey(position)) return;
    View prev = viewMap.getPrev(position);
    View next = viewMap.getNext(position);
    boolean wasLast = next == null;
    viewMap.remove(position);
    if (prev != null && next != null) {
      linkPosition(prev, next);
    } else if (wasLast) {
      unlinkLast();
    }
  }

  public void refreshIndexes(View view, int position) {
    viewMap.put(position, view);
    viewMap.forEachLive((pos, current) -> {
      View next = viewMap.getNext(pos);
      if (next != null) linkPosition(current, next);
    });
    unlinkLast();
  }

  public boolean isEmpty() {
    return viewMap.isEmpty();
  }
}
