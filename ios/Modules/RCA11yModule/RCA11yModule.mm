//
//  RCA11yModule.m
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//


#import "RCA11yFocusWrapper.h"
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import "GameController/GameController.h"
#import "GameController/GCKeyboard.h"
#import <React/RCTUIManager.h>
#import "RCA11yModule.h"
#import "UIViewController+RCA11y.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNA11ySpec/RNA11ySpec.h"
using namespace facebook::react;

#endif

@implementation RCA11yModule
{
    bool hasListeners;
}

NSString * const PREFS_MY_CONSTANT = @"keyboardStatus";
NSString * const EVENT_PROP = @"status";

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[PREFS_MY_CONSTANT];
}

-(void) keyboardWasConnected: (NSNotification *) notification {
    if (hasListeners) {
        [self sendEventWithName: PREFS_MY_CONSTANT body:@{EVENT_PROP: @(YES)}];
    }
}

-(void) keyboardWasDisconnected: (NSNotification *) notification {
    if (hasListeners) {
        [self sendEventWithName: PREFS_MY_CONSTANT body:@{EVENT_PROP: @(NO)}];
    }
}

- (instancetype)init
{
    if(self = [super init]) {
        if (@available(iOS 14.0, *)) {
            Class GCKeyboardClass = NSClassFromString(@"GCKeyboard");
            if(GCKeyboardClass != nil) {
                [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWasConnected:) name: @"GCKeyboardDidConnectNotification" object:nil];
                [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWasDisconnected:) name: @"GCKeyboardDidDisconnectNotification" object:nil];
            }
        }
    }

    return self;
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

RCT_EXPORT_MODULE(RCA11yModule);


RCT_EXPORT_METHOD(announceForAccessibility: (nonnull NSString*)announcement) {
    if (@available(iOS 11.0, *)) {
        UIAccessibilityPostNotification(UIAccessibilityAnnouncementNotification, announcement);
    }
}

RCT_EXPORT_METHOD(announceScreenChange: (nonnull NSString*) title) {
    UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, title);
}

RCT_EXPORT_METHOD(setAccessibilityFocus: (nonnull NSNumber *)nativeTag) {
    dispatch_async(dispatch_get_main_queue(), ^{
        if(![nativeTag isEqual: [NSNull null]]) {
            UIView *field = [self.bridge.uiManager viewForReactTag:nativeTag];
            if(field != nil) {
                UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, field);
            }
        }
    });
}


RCT_EXPORT_METHOD(setKeyboardFocus: (nonnull NSNumber *)nativeTag) {
    dispatch_async(dispatch_get_main_queue(), ^{
        if(![nativeTag isEqual: [NSNull null]]) {
            UIView *field = [self.bridge.uiManager viewForReactTag:nativeTag];
            if(field != nil) {
              UIViewController *controller = field.reactViewController;

              if (controller != nil) {
                controller.customFocusView = field;
                dispatch_async(dispatch_get_main_queue(), ^{
                  [controller setNeedsFocusUpdate];
                  [controller updateFocusIfNeeded];
                });
              }
            }
        }
    });
}

RCT_EXPORT_METHOD(setPreferredKeyboardFocus:(nonnull NSNumber *)nativeTag) {
    dispatch_async(dispatch_get_main_queue(), ^{
        if(![nativeTag isEqual: [NSNull null]]) {
            UIView *field = [self.bridge.uiManager viewForReactTag:nativeTag];
            if(field != nil) {
              UIViewController *controller = field.reactViewController;
            }
        }
    });
}

RCT_EXPORT_METHOD(
                  setA11yOrder: (nonnull NSArray *)elements
                  node:(nonnull NSNumber *)node
                  ) {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView *field = [self.bridge.uiManager viewForReactTag:node];
        if(field != nil) {
            UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, field); // ToDo, make this optional
        }
        NSMutableArray *fields = [NSMutableArray arrayWithCapacity:[elements count]];

        [elements enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL * stop) {
            NSNumber *tag = (NSNumber *)obj;
            UIView *field = [self.bridge.uiManager viewForReactTag:tag];
            if (field != nil) {
                [fields addObject:field];
            }
        }];
        [field setAccessibilityElements: fields];
    });
}

RCT_EXPORT_METHOD(
                  isKeyboardConnected: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  ) {
    if (@available(iOS 14.0, *)) {
        Class GCKeyboardClass = NSClassFromString(@"GCKeyboard");
        if (GCKeyboardClass != nil) {
            bool isConnected = [GCKeyboardClass coalescedKeyboard] != nil;
            resolve(isConnected ? @(YES) : @(NO));
        } else {
            reject(@"GC_FRAMEWORK_LINKING_ERROR", @"The GameController framework is not linked. Please verify the iOS section in the react-native-a11y Readme.md", nil);
        }
    } else {
        reject(@"IOS_VERSION_IS_NOT_SUPPORTED", @"iOS version less than 14.0", nil);
    }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeA11yModuleSpecJSI>(params);
}
#endif

@end
