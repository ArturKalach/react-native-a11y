//
//  RCA11yViewFocusRequestBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "UIViewController+RCA11y.h"

#import "UIView+React.h"
#import "RCA11yViewFocusRequestBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yNativeProps.h"
#import "RCA11yFabricEventHelper.h"
#endif

@implementation RCA11yViewFocusRequestBase {
  BOOL _isAttachedToWindow;
  BOOL _autoFocusRequested;
}

- (void)cleanReferences {
  [super cleanReferences];
  _isAttachedToWindow = NO;
  _autoFocusRequested = NO;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _isAttachedToWindow = NO;
    _autoFocusRequested = NO;
  }

  return self;
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  if (controller != nil) {
    [controller rca11yFocusView: self];
  }
}

- (void)screenReaderFocus {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *focusView = [self getFocusTargetView];
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification,
                                    focusView);
  });
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusRequestProps:(const RCA11y::AutoFocusProps &)oldProps
newProps:(const RCA11y::AutoFocusProps &)newProps {
    if (oldProps.autoFocus != newProps.autoFocus) {
      [self setAutoFocus: newProps.autoFocus];
    }
}


#endif


- (void)onAttached
{
  [self focusOnMount];
}

- (void)focusOnMount {
  if (self.autoFocus) {
    if(!_autoFocusRequested) {
      _autoFocusRequested = YES;
      dispatch_async(dispatch_get_main_queue(), ^{
        dispatch_async(dispatch_get_main_queue(), ^{
          [self focus];
        });
      });
    }
  }
}


- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    [self onAttached];
  }

  if (self.window && !_isAttachedToWindow) {
    if (self.autoFocus) {
      [self focus];
    }
    _isAttachedToWindow = YES;
  }
}


@end
