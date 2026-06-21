//
//  RCA11ySRView.mm
//  react-native-a11y
//

#import "RCA11ySRView.h"
#import "UIView+RCA11y.h"

@implementation RCA11ySRView

- (void)onScreenReaderFocusChangeHandler:(BOOL)isFocused {}

- (void)onFocusItemLinked:(UIView *)view {
  [view setScreenReaderFocusDelegate: self];
}

- (void)onFocusItemRemoved:(UIView *)view {
  [view clearScreenReaderFocusDelegate];
}

- (void)onScreenReaderFocusChanged:(BOOL)focused {
  [self onScreenReaderFocusChangeHandler: focused];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)focusView {
  UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
}
#endif

@end
