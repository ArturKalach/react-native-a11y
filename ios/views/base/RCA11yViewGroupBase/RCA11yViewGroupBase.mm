//
//  RCA11yViewGroupBase.mm
//  react-native-a11y
//

#import "RCA11yViewGroupBase.h"

@interface RCA11yViewGroupBase ()

@property (nonatomic, weak, nullable) UIView *storedView;

@end


@implementation RCA11yViewGroupBase

- (void)didAddSubview:(UIView *)subview {
  [super didAddSubview:subview];

  if (self.storedView == nil) {
    self.storedView = subview;
    [self onSubviewAdded:subview];
  }
}

- (void)cleanReferences{
  self.storedView = nil;
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];

  if (self.storedView == subview) {
    self.storedView = nil;
    [self onSubviewRemoved:subview];
  }
}

- (UIView*)getStoredView {
  return self.storedView;
}

#pragma mark - Layout updates

- (void)layoutSubviews {
  [super layoutSubviews];

  if (self.storedView != nil) {
    [self onSubviewsLayoutUpdated];
  }
}

#pragma mark - Hooks (override in subclass)

- (void)onSubviewAdded:(UIView *)subview {}

- (void)onSubviewRemoved:(UIView *)subview {}

- (void)onSubviewsLayoutUpdated {}

- (BOOL)focusableWrapper {
  return NO;
}

@end
