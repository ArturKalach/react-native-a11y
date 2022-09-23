//
//  KeyboardFocus.swift
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import React
import SwiftUI

protocol KeyboardFocus {
  var myPreferredFocusedView: UIView! { get set }
  mutating func updateKeyboardFocus(nextView: UIView) -> Void
  mutating func setPreferredKeyboardFocus(nextView: UIView) -> Void
}

extension KeyboardFocus where Self: UIView {
  mutating func updateKeyboardFocus(nextView: UIView) {
    self.myPreferredFocusedView = nextView
    setNeedsFocusUpdate()
    updateFocusIfNeeded()
    self.myPreferredFocusedView = self
  }
  
  mutating func setPreferredKeyboardFocus(nextView: UIView) {
    self.myPreferredFocusedView = nextView
    setNeedsFocusUpdate()
    updateFocusIfNeeded()
  }
}
