//
//  RCTKeyboardFocusWrapper.swift
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React
import UIKit

class RCA11yFocusWrapper: RCTView, KeyboardFocus {
  var myPreferredFocusedView: UIView! = nil
  
  @objc var onFocusChange: RCTBubblingEventBlock?
  @objc var canBeFocused: Bool = true
  
  override var preferredFocusEnvironments: [UIFocusEnvironment] {
    if (myPreferredFocusedView == nil) {
      return []
    }
    return [myPreferredFocusedView]
  }
  
  open override var canBecomeFocused: Bool {
    return canBeFocused
  }
  
  
  
  override func didUpdateReactSubviews() {
    super.didUpdateReactSubviews()

    if #available(iOS 14.0, *) {
      self.focusGroupIdentifier = "app.group.\(String(describing: self.reactTag))"
    }
  }
  
  override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
    
    if context.nextFocusedView == self {
      let params: [String: Bool] = ["isFocused": true]
      onFocusChange?(params)
    }
    else if context.previouslyFocusedView == self {
      let params: [String: Bool] = ["isFocused": false]
      onFocusChange?(params)
    }
  }
}
