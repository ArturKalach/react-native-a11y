//
//  KeyboardFocusManager.swift
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React

protocol KeyboardFocusManager {
  var bridge: RCTBridge! { get set }
  func updateKeyboardFocus(_ node: NSNumber, nextElementId: NSNumber) -> Void
  func preferredKeyboardFocus(_ node: NSNumber, nextElementId: NSNumber) -> Void
}

extension KeyboardFocusManager {
  func updateKeyboardFocusableViews(_ current: NSNumber, next: NSNumber, completion: @escaping (KeyboardFocus, UIView) -> ()) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: current
      )
      let nextFocusElement = self.bridge.uiManager.view(
        forReactTag: next
      )
      if (component != nil && nextFocusElement != nil) {
        if let keyboardFocusable = component as? KeyboardFocus {
          completion(keyboardFocusable, nextFocusElement!)
        }
      }
    }
  }
  func updateKeyboardFocus(_ node: NSNumber, nextElementId: NSNumber) {
    updateKeyboardFocusableViews(node, next: nextElementId, completion:{ (keyboardFocusable, nextFocusElement) in
        var component = keyboardFocusable
        component.updateKeyboardFocus(nextView: nextFocusElement)
    })
  }

  func preferredKeyboardFocus(_ node: NSNumber, nextElementId: NSNumber) {
    updateKeyboardFocusableViews(node, next: nextElementId, completion:{ (keyboardFocusable, nextFocusElement) in
        var component = keyboardFocusable
        component.setPreferredKeyboardFocus(nextView: nextFocusElement)
    })
  }
}
