//
//  RCTCustomScrollView+RCA11y.mm
//  react-native-a11y
//
#ifndef RCT_NEW_ARCH_ENABLED

#import "RCTScrollView.h"
#import "RCA11ySwizzleInstanceMethod.h"

static void RCA11yRCTScrollViewSwizzle(void) {
  RCA11ySwizzleInstanceMethod([RCTScrollView class], @selector(initWithEventDispatcher:), @selector(rca11yInitWithEventDispatcher:));
}

@implementation RCTScrollView (RCA11y)

RCA11y_INSTALL_SWIZZLES(RCA11yRCTScrollViewSwizzle)

- (instancetype)rca11yInitWithEventDispatcher:(CGRect)frame {
  RCTScrollView *rctView = [self rca11yInitWithEventDispatcher:frame];

  if (@available(iOS 17.0, *)) {
    rctView.scrollView.allowsKeyboardScrolling = YES;
  }

  return rctView;
}


@end

#endif
