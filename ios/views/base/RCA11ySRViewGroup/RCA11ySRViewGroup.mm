//
//  RCA11ySRViewGroup.mm
//  react-native-a11y
//

#import "RCA11ySRViewGroup.h"

@implementation RCA11ySRViewGroup {
  __weak UIView* _subChild;
}

- (nullable UIView*)getSubChild {
  return _subChild;
}

- (void)onChildAttached:(UIView*)child {}
- (void)onChildRemoved {}

- (void)setSubChildInternal:(nullable UIView*)child {
  _subChild = child;
  if (child != nil) {
    [self onChildAttached: child];
  } else {
    [self onChildRemoved];
  }
}

- (void)didAddSubview:(UIView *)subview {
  [super didAddSubview:subview];
  if (_subChild == nil) {
    [self setSubChildInternal: subview];
  }
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];
  if (_subChild == subview) {
    [self setSubChildInternal: nil];
  }
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (self.window == nil) {
    [self setSubChildInternal: nil];
  } else if (_subChild == nil && self.subviews.count > 0) {
    [self setSubChildInternal: self.subviews[0]];
  }
}

@end
