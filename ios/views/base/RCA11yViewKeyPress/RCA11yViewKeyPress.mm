//
//  RCA11yViewKeyPress.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yViewKeyPress.h"
#import "RCA11yKeyboardKeyPressHandler.h"




@implementation RCA11yViewKeyPress {
  RCA11yKeyboardKeyPressHandler *_keyboardKeyPressHandler;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
    _keyboardKeyPressHandler = [[RCA11yKeyboardKeyPressHandler alloc] init];
  }

  return self;
}

- (void)cleanReferences {
  [super cleanReferences];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateKeyPressProps:(const RCA11y::KeyPressProps &)oldProps
                   newProps:(const RCA11y::KeyPressProps &)newProps {
  if (oldProps.hasKeyUpPress != newProps.hasKeyUpPress) {
    [self setHasOnPressUp:newProps.hasKeyUpPress];
  }

  if (oldProps.hasKeyDownPress != newProps.hasKeyDownPress) {
    [self setHasOnPressDown:newProps.hasKeyDownPress];
  }
}

#endif


- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
  NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses
                                                              withEvent:event];

  if (self.hasOnPressUp || self.hasOnPressDown) {
    [self onKeyDownPressHandler:eventInfo];
  }

  [super pressesBegan:presses withEvent:event];
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
  NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses
                                                            withEvent:event];

  if (self.hasOnPressUp || self.hasOnPressDown) {
    [self onKeyUpPressHandler:eventInfo];
  }

  [super pressesEnded:presses withEvent:event];
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo{}
- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo{}


@end
