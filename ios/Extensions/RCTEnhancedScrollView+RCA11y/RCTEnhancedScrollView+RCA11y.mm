//
//  RCTEnhancedScrollView+RCA11y.mm
//  react-native-a11y
//


#ifdef RCT_NEW_ARCH_ENABLED

#import "RCTEnhancedScrollView.h"
#import "RCA11ySwizzleInstanceMethod.h"
#import "RCTScrollViewComponentView.h"

static void RCA11yEnhancedScrollViewSwizzle(void) {
  RCA11ySwizzleInstanceMethod([RCTEnhancedScrollView class], @selector(initWithFrame:), @selector(rca11yInitWithFrame:));
}

@implementation RCTEnhancedScrollView (RCA11y)

RCA11y_INSTALL_SWIZZLES(RCA11yEnhancedScrollViewSwizzle)

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
  @try {
    BOOL isScrollViewComponent = self.superview &&
    [self.superview isKindOfClass:[RCTScrollViewComponentView class]];

    if (isScrollViewComponent) {
      RCTScrollViewComponentView *scrollViewComponent = (RCTScrollViewComponentView *)self.superview;
      return @[scrollViewComponent.containerView];
    }
  }
  @catch (NSException *exception) {
  }

  return [super preferredFocusEnvironments];
}

- (instancetype)rca11yInitWithFrame:(CGRect)frame {
  RCTEnhancedScrollView *scrollView = [self rca11yInitWithFrame:frame];

  if (@available(iOS 17.0, *)) {
    scrollView.allowsKeyboardScrolling = YES;
  }

  return scrollView;
}

@end


#endif
