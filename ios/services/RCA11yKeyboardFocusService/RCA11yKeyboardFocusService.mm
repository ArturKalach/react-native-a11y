//
//  RCA11yKeyboardFocusService.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yKeyboardFocusService.h"
#import "UIViewController+RCA11y.h"
#import <React/RCTUtils.h>

@implementation RCA11yKeyboardFocusService

+ (UIView *)getFocusedItem:(id<UIFocusEnvironment>)environment {
  if (!environment) {
    return nil;
  }

  @try {
    UIFocusSystem *focusSystem = [UIFocusSystem focusSystemForEnvironment:environment];
    if (![focusSystem.focusedItem isKindOfClass:[UIView class]]) {
      return nil;
    }

    return (UIView *)focusSystem.focusedItem;
  } @catch (NSException *exception) {
    return nil;
  }
}

+ (void)updatePreferredFocusEnvironment:(UIView *)view {
  if (!view) {
    return;
  }

  UIWindow *window = RCTKeyWindow();
  if (window && window.rootViewController) {
    window.rootViewController.rca11yCustomFocusView = view;
  }
}

+ (void)focus:(UIView *)view {
  if (!view) {
    return;
  }

  UIWindow *window = RCTKeyWindow();
  if (window && window.rootViewController) {
    [window.rootViewController rca11yFocusView:view];
  }
}

@end
