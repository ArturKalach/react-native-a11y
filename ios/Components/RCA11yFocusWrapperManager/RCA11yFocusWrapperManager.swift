//
//  RCTKeyboardFocusWrapperManager.swift
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation

@objc (RCA11yFocusWrapperManager)
class RCA11yFocusWrapperManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    return RCA11yFocusWrapper()
  }
}
