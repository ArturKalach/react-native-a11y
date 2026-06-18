//
//  UIView+RCA11y.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "UIView+RCA11y.h"
#import "RCA11ySwizzleInstanceMethod.h"
#import <objc/runtime.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif

@interface RCA11yWeakWrapper : NSObject
@property (nonatomic, weak) id value;
@end

@implementation RCA11yWeakWrapper
@end

static char kRCA11yScreenReaderFocusDelegate;

@implementation UIView (RCA11y)

- (void)setScreenReaderFocusDelegate:(id<RCA11yScreenReaderFocusDelegate>)focusDelegate {
  RCA11yWeakWrapper *weakDelegate = [[RCA11yWeakWrapper alloc] init];
  [weakDelegate setValue: focusDelegate];
  objc_setAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate, weakDelegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)clearScreenReaderFocusDelegate {
  objc_setAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (id<RCA11yScreenReaderFocusDelegate>)getScreenReaderFocusDelegate {
  @try {
    RCA11yWeakWrapper *wrapper = objc_getAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate);
    return wrapper ? wrapper.value : nil;
  } @catch (NSException *exception) {
    return nil;
  }
}

- (void)trigerScreenReaderFocusDelegate:(BOOL)focused {
  id<RCA11yScreenReaderFocusDelegate> delegate = [self getScreenReaderFocusDelegate];
  if (delegate && [delegate respondsToSelector:@selector(onScreenReaderFocusChanged:)]) {
    [delegate onScreenReaderFocusChanged: focused];
  }
}


static void RCA11yRegisterViewFocusSwizzles(void) {
  #ifdef RCT_NEW_ARCH_ENABLED
    Class swizzleClass = objc_getClass("RCTViewComponentView");
  #else
    Class swizzleClass = objc_getClass("RCTView");
  #endif
  if (!swizzleClass) return;

  RCA11ySwizzleInstanceMethod(swizzleClass,
                              @selector(accessibilityElementDidBecomeFocused),
                              @selector(rca11y_accessibilityElementDidBecomeFocused));
  RCA11ySwizzleInstanceMethod(swizzleClass,
                              @selector(accessibilityElementDidLoseFocus),
                              @selector(rca11y_accessibilityElementDidLoseFocus));
}

RCA11y_INSTALL_SWIZZLES(RCA11yRegisterViewFocusSwizzles)

- (void)rca11y_accessibilityElementDidBecomeFocused {
  [self rca11y_accessibilityElementDidBecomeFocused];
  [self trigerScreenReaderFocusDelegate: true];
}

- (void)rca11y_accessibilityElementDidLoseFocus {
  [self rca11y_accessibilityElementDidLoseFocus];
  [self trigerScreenReaderFocusDelegate: false];
}

@end
