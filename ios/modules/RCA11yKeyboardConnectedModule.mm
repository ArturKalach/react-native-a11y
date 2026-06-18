//
//  RCA11yKeyboardConnectedModule.mm
//  react-native-a11y
//
//  Ported from react-native-is-keyboard-connected's IsKeyboardConnected.mm,
//  renamed into the react-native-a11y native namespace.
//

#import "RCA11yKeyboardConnectedModule.h"

#import "GameController/GameController.h"
#import "GameController/GCKeyboard.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>
#endif

@implementation RCA11yKeyboardConnectedModule {
  bool hasListeners;
}

NSString *const RCA11yKeyboardStatusEvent = @"keyboardStatus";
NSString *const RCA11yKeyboardStatusProp = @"status";

- (instancetype)init
{
  if (self = [super init]) {
    if (@available(iOS 14.0, *)) {
      Class GCKeyboardClass = NSClassFromString(@"GCKeyboard");
      if (GCKeyboardClass != nil) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(keyboardWasConnected:)
                                                     name:@"GCKeyboardDidConnectNotification"
                                                   object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(keyboardWasDisconnected:)
                                                     name:@"GCKeyboardDidDisconnectNotification"
                                                   object:nil];
      }
    }
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (void)startObserving
{
  hasListeners = YES;
}

- (void)stopObserving
{
  hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[ RCA11yKeyboardStatusEvent ];
}

- (void)keyboardWasConnected:(NSNotification *)notification
{
  if (hasListeners) {
    [self sendEventWithName:RCA11yKeyboardStatusEvent body:@{RCA11yKeyboardStatusProp : @(YES)}];
  }
}

- (void)keyboardWasDisconnected:(NSNotification *)notification
{
  if (hasListeners) {
    [self sendEventWithName:RCA11yKeyboardStatusEvent body:@{RCA11yKeyboardStatusProp : @(NO)}];
  }
}

RCT_EXPORT_MODULE(A11yKeyboardConnectedModule);

RCT_EXPORT_METHOD(isKeyboardConnected:(RCTPromiseResolveBlock)resolve
                              reject:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14.0, *)) {
    Class GCKeyboardClass = NSClassFromString(@"GCKeyboard");
    if (GCKeyboardClass != nil) {
      bool isConnected = [GCKeyboardClass coalescedKeyboard] != nil;
      resolve(isConnected ? @(YES) : @(NO));
    } else {
      reject(@"GC_FRAMEWORK_LINKING_ERROR",
             @"The GameController framework is not linked. Please verify the iOS setup in the react-native-a11y Readme.md",
             nil);
    }
  } else {
    reject(@"IOS_VERSION_IS_NOT_SUPPORTED", @"iOS version less than 14.0", nil);
  }
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeA11yKeyboardConnectedModuleSpecJSI>(params);
}
#endif

@end
