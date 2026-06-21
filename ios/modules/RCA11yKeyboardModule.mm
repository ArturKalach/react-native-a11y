//
//  RCA11yKeyboardModule.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCA11yKeyboardModule.h"
#import "UIViewController+RCA11y.h"
#import "RCA11yViewResolver.h"
#import <React/RCTUtils.h>
#import <React/RCTBridgeModule.h>
#import <React/UIView+React.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>
using namespace facebook::react;
#endif

@implementation RCA11yKeyboardModule

// Cross-arch view lookup — see RCA11yViewResolver.h.
@synthesize viewRegistry_DEPRECATED = _viewRegistry;
@synthesize bridge = _bridge;

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

RCT_EXPORT_MODULE(RCA11yKeyboardModule);

RCT_EXPORT_METHOD(dismissKeyboard:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    UIWindow *window = RCTKeyWindow();
    if (window) {
      [window endEditing:YES];
    }
    resolve(@YES);
  });
}

// Resolves the view for `nativeTag` and applies the keyboard-focus override on
// its view controller. `force == YES` triggers an immediate focus update
// (`setKeyboardFocus`); `force == NO` only marks it preferred
// (`setPreferredKeyboardFocus`). Faithful port of the legacy 0.7 behavior.
- (void)_focusReactTag:(double)nativeTag force:(BOOL)force {
  if (nativeTag <= 0) {
    return;
  }
  __weak RCA11yKeyboardModule *weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    RCA11yKeyboardModule *strongSelf = weakSelf;
    if (strongSelf == nil) {
      return;
    }
    UIView *view = RCA11yResolveView(
        @((NSInteger)nativeTag), strongSelf.viewRegistry_DEPRECATED, strongSelf.bridge);
    if (view == nil) {
      return;
    }
    UIViewController *controller = view.reactViewController;
    if (controller == nil) {
      return;
    }
    if (force) {
      [controller rca11yFocusView:view];
    } else {
      controller.rca11yCustomFocusView = view;
    }
  });
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)setKeyboardFocus:(double)nativeTag {
  [self _focusReactTag:nativeTag force:YES];
}

- (void)setPreferredKeyboardFocus:(double)nativeTag {
  [self _focusReactTag:nativeTag force:NO];
}

#else

RCT_EXPORT_METHOD(setKeyboardFocus:(double)nativeTag) {
  [self _focusReactTag:nativeTag force:YES];
}

RCT_EXPORT_METHOD(setPreferredKeyboardFocus:(double)nativeTag) {
  [self _focusReactTag:nativeTag force:NO];
}

#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeRCA11yKeyboardModuleSpecJSI>(params);
}
#endif

@end
