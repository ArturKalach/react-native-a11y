package com.reactnativea11y.linking;

import android.view.View;

import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;

/**
 * Unified order-linking engine — merges the singletons from both source packages.
 *
 * - Index-based ordering (keyed by `orderKey` for screen reader / `orderGroup` for
 *   keyboard) via {@link A11yLinkingQueue}, which wires both `nextFocusForward`
 *   and `accessibilityTraversalBefore`.
 * - Link-based directional ordering (`orderId` targets) via the weak map +
 *   {@code FocusLinkObserver} (keyboard).
 */
public class A11yOrderLinking {

  private static A11yOrderLinking instance;
  private final Map<String, A11yLinkingQueue> relationships;
  private final Map<String, View> weakMap;

  private A11yOrderLinking() {
    relationships = new HashMap<>();
    weakMap = new WeakHashMap<>();
  }

  public static synchronized A11yOrderLinking getInstance() {
    if (instance == null) {
      instance = new A11yOrderLinking();
    }
    return instance;
  }

  // ─── Link-based (orderId) ───────────────────────────────────────────────────

  public void addOrderLink(View view, String key) {
    this.weakMap.put(key, view);
  }

  public void removeOrderLink(String key) {
    this.weakMap.remove(key);
  }

  public View getOrderLink(String key) {
    return this.weakMap.get(key);
  }

  // ─── Index-based (orderKey / orderGroup) ────────────────────────────────────

  public void refreshIndexes(View view, String key, int position) {
    A11yLinkingQueue queue = relationships.get(key);
    if (queue != null) {
      queue.refreshIndexes(view, position);
    }
  }

  public void addViewRelationship(View view, String key, int position) {
    A11yLinkingQueue queue = relationships.get(key);
    if (queue == null) {
      queue = new A11yLinkingQueue();
      relationships.put(key, queue);
    }
    queue.addPosition(view, position);
  }

  public void removeRelationship(String key, int index) {
    A11yLinkingQueue queue = relationships.get(key);
    if (queue == null) return;

    queue.removeFromOrder(index);

    if (queue.isEmpty()) {
      relationships.remove(key);
    }
  }

  public void updateGroup(String prev, String next, Integer position, View child) {
    if (prev != null && prev.equals(next)) return;
    if (prev != null) {
      A11yLinkingQueue queue = relationships.get(prev);
      if (queue != null) {
        queue.removeFromOrder(position);

        if (queue.isEmpty()) {
          relationships.remove(prev);
        }
      }
    }

    if (next != null && position != null && child != null) {
      this.addViewRelationship(child, next, position);
    }
  }
}
