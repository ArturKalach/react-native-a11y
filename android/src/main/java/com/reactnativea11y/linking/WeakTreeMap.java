package com.reactnativea11y.linking;

import android.view.View;

import java.lang.ref.WeakReference;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

public class WeakTreeMap {
  private final NavigableMap<Integer, WeakReference<View>> viewMap = new TreeMap<>();

  public void put(int position, View view) {
    viewMap.put(position, new WeakReference<>(view));
  }

  public View get(int position) {
    WeakReference<View> ref = viewMap.get(position);
    return ref != null ? ref.get() : null;
  }

  public void remove(int position) {
    viewMap.remove(position);
    // Purge zombie entries left by GC while we're already mutating the map.
    viewMap.values().removeIf(ref -> ref.get() == null);
  }

  /**
   * Returns the nearest live view at a position strictly greater than {@code position},
   * skipping any GC'd entries along the way.
   */
  public View getNext(int position) {
    for (WeakReference<View> ref : viewMap.tailMap(position, false).values()) {
      View v = ref.get();
      if (v != null) return v;
    }
    return null;
  }

  /**
   * Returns the nearest live view at a position strictly less than {@code position},
   * skipping any GC'd entries along the way.
   */
  public View getPrev(int position) {
    for (WeakReference<View> ref : viewMap.headMap(position, false).descendingMap().values()) {
      View v = ref.get();
      if (v != null) return v;
    }
    return null;
  }

  /** Returns the live view with the highest position, skipping any GC'd entries. */
  public View last() {
    for (WeakReference<View> ref : viewMap.descendingMap().values()) {
      View v = ref.get();
      if (v != null) return v;
    }
    return null;
  }

  public boolean containsKey(int position) {
    return viewMap.containsKey(position);
  }

  /** Returns {@code true} only if there are no live (non-GC'd) views in the map. */
  public boolean isEmpty() {
    for (WeakReference<View> ref : viewMap.values()) {
      if (ref.get() != null) return false;
    }
    return true;
  }

  /** Visits every live entry in ascending position order. */
  public void forEachLive(LiveEntryAction action) {
    for (Map.Entry<Integer, WeakReference<View>> entry : viewMap.entrySet()) {
      View v = entry.getValue().get();
      if (v != null) action.run(entry.getKey(), v);
    }
  }

  public interface LiveEntryAction {
    void run(int position, View view);
  }
}
