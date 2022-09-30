//
//  A11yModule.m
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTEventEmitter.h"
#import "React/RCTBridgeModule.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>


@interface RCT_EXTERN_MODULE(RCA11yModule, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  announceForAccessibility: (NSString)announcement
                  )

RCT_EXTERN_METHOD(
                  announceScreenChange: (NSString)title
                  )

RCT_EXTERN_METHOD(
                  setAccessibilityFocus: (nonnull NSNumber *)nativeTag
                  )
RCT_EXTERN_METHOD(
                  setPreferredKeyboardFocus:(nonnull NSNumber *)itemId
                  nextElementId:(nonnull NSNumber *)nextElementId
                  )
RCT_EXTERN_METHOD(
                  setKeyboardFocus:(nonnull NSNumber *)itemId
                  nextElementId:(nonnull NSNumber *)nextElementId
                  )
RCT_EXTERN_METHOD(
                  setA11yOrder: (nonnull NSArray *)elements
                  node:(nonnull NSNumber *)node
                  )
RCT_EXTERN_METHOD(
                  isKeyboardConnected: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

//#ifdef RCT_NEW_ARCH_ENABLED
//- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//    (const facebook::react::ObjCTurboModule::InitParams &)params
//{
//    return std::make_shared<facebook::react::NativeCalculatorSpecJSI>(params);
//}
//#endif


@end
