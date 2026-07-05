//
//  RCA11yViewFocusChangeBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>


#import "RCA11yViewFocusChangeBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yNativeProps.h"
#import "RCA11yFabricEventHelper.h"
#endif

@implementation RCA11yViewFocusChangeBase {
  NSNumber* _isFocused;
}

- (BOOL)isKeyboardFocused {
  return [_isFocused isEqual:@YES];
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _focusDelegate = [[RCA11yFocusDelegate alloc] initWithView:self];
    _isFocused = nil;
  }

  return self;
}

- (void)cleanReferences {
  [super cleanReferences];
  [_focusDelegate reset];
  _isFocused = nil;
  _canBeFocused = false;
  _hasOnFocusChanged = false;
}

- (UIView *)getFocusTargetView {
  return [_focusDelegate getFocusingView];
}


- (BOOL)canBecomeFocused {
  if (!self.focusableWrapper) {
    return _canBeFocused;
  }

  return [super canBecomeFocused];
}


- (NSNumber *)resolveFocusChange:(UIFocusUpdateContext *)context {
  return [_focusDelegate isFocusChanged:context];
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  _isFocused = [self resolveFocusChange:context];

  if ([self hasOnFocusChanged]) {
    if (_isFocused != nil) {
      [self onFocusChangeHandler:[_isFocused isEqual:@YES]];
    }
  }

  [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusProps:(const RCA11y::FocusProps &)oldProps
                          newProps:(const RCA11y::FocusProps &)newProps {
  if (_canBeFocused != newProps.canBeFocused) {
    [self setCanBeFocused:newProps.canBeFocused];
  }

  if (_hasOnFocusChanged != newProps.hasOnFocusChanged) {
    [self setHasOnFocusChanged:newProps.hasOnFocusChanged];
  }
}

#endif

- (void)onFocusChangeHandler:(BOOL)isFocused {}

@end
