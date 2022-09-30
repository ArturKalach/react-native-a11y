//
//  A11yOrderManager.swift
//  A11y
//
//  Created by Artur Kalach on 03.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import React

protocol A11yOrderManager {
  var bridge: RCTBridge! { get set }
  func setAccessibilityElements(_ node: NSNumber, elements: [NSNumber]) -> Void
}

extension A11yOrderManager {
  func setAccessibilityElements(_ node: NSNumber, elements: [NSNumber]) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      )
      let views = elements.map {
        self.bridge.uiManager.view(
            forReactTag: $0
        )
      }.filter {
        $0 != nil
      }
      
      if(component != nil && views.count > 0) {
        component!.shouldGroupAccessibilityChildren = false
        component!.accessibilityElements = views as [Any]
      } else if (component != nil) {
        component!.accessibilityElements = nil
      }
    }
  }
}
