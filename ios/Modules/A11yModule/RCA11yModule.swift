//
//  A11yModule.swift
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import UIKit
import React
import GameController

@objc(RCA11yModule)
class RCA11yModule : RCTEventEmitter, KeyboardFocusManager, A11yOrderManager {
    let keyboardStatusEvent: String = "keyboardStatus"
    
    let eventProp = "status";
    
    override init(){
        super.init()
        
        if #available(iOS 14.0, *) {
            NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWasConnected(notification:)), name: Notification.Name.GCKeyboardDidConnect, object: nil)
            NotificationCenter.default.addObserver(self, selector: #selector(self.keyboardWasDisconnected(notification:)), name: Notification.Name.GCKeyboardDidDisconnect, object: nil)
        }
        
    }
    
    override func supportedEvents() -> [String]! {
        return [keyboardStatusEvent]
    }
    

    @objc func keyboardWasConnected(notification: Notification) {
        sendEvent(withName: keyboardStatusEvent, body: [eventProp: true])
    }
    
    @objc func keyboardWasDisconnected(notification: Notification) {
        sendEvent(withName: keyboardStatusEvent, body: [eventProp: false])
    }
    
    
    
    @objc
    func announceForAccessibility(_ announcement: String) -> Void {
        if #available(iOS 11.0, *) {
            let message: NSAttributedString = NSAttributedString(string: announcement, attributes: [.accessibilitySpeechQueueAnnouncement: true])
            UIAccessibility.post(notification: .announcement, argument: message)
        }
    }
    
    @objc
    func setA11yOrder(_ elements: NSArray, node: NSNumber) {
        self.setAccessibilityElements(node, elements: elements as! [NSNumber])
    }
    
    @objc
    func setPreferredKeyboardFocus(_ itemId: NSNumber, nextElementId: NSNumber) -> Void {
        self.preferredKeyboardFocus(itemId, nextElementId: nextElementId)
    }
    
    @objc
    func setKeyboardFocus(_ itemId: NSNumber, nextElementId: NSNumber) -> Void {
        self.updateKeyboardFocus(itemId, nextElementId: nextElementId)
    }
    
    @objc
    func announceScreenChange (_ title: String? = nil) -> Void {
        UIAccessibility.post(notification: .screenChanged, argument: title)
    }
    
    @objc
    func setAccessibilityFocus(_ nativeTag: NSNumber) -> Void {
        DispatchQueue.main.async {
            if nativeTag != -1 {
                let reactComponent = self.bridge.uiManager.view(forReactTag: nativeTag)
                if reactComponent != nil {
                    UIAccessibility.post(notification: .screenChanged, argument: reactComponent)
                }
            }
        }
    }
    
    @objc
    func isKeyboardConnected(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        if #available(iOS 14.0, *) {
            resolve(GCKeyboard.coalesced != nil)
        } else {
            reject("ios version is not supported", "version less than 14.0", nil)
        }
    }
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

