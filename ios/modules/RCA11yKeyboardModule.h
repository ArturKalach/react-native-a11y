//
//  RCA11yKeyboardModule.h
//  react-native-a11y
//
//  Keyboard imperative module backing `Keyboard` (ported from
//  react-native-external-keyboard's RNCEKVExternalKeyboardModule).
//

#ifndef RCA11yKeyboardModule_h
#define RCA11yKeyboardModule_h

#import <Foundation/Foundation.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>

@interface RCA11yKeyboardModule : NSObject <NativeRCA11yKeyboardModuleSpec>

#else

#import <React/RCTBridgeModule.h>

@interface RCA11yKeyboardModule : NSObject <RCTBridgeModule>

- (void)dismissKeyboard:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject;

- (void)setKeyboardFocus:(double)nativeTag;
- (void)setPreferredKeyboardFocus:(double)nativeTag;

#endif

@end

#endif /* RCA11yKeyboardModule_h */
