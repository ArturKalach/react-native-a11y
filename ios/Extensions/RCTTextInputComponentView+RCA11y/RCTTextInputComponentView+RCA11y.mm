//
//  RCTTextInputComponentView+RCA11y.mm
//  react-native-a11y
//
#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTTextInputComponentView+RCA11y.h"
#import <React/RCTBackedTextInputViewProtocol.h>
#import <objc/runtime.h>
#import "RCA11yCustomFocusEffectProtocol.h"
#import "RCTUITextField.h"
#import "RCTUITextView.h"

@implementation RCTTextInputComponentView (RCA11y)

- (UIView *)rca11yBackedTextInputView {
  Ivar ivar = class_getInstanceVariable([self class], "_backedTextInputView");
  if (!ivar) {
    return nil;
  }

  id value = object_getIvar(self, ivar);
  if ([value isKindOfClass:[UIView class]]) {
    return (UIView*)value;
  }
  return nil;
}

@end

@implementation RCTUITextField (RCA11y)
  - (UIFocusEffect*)focusEffect API_AVAILABLE(ios(15.0)) {
    id superParent = self.superview.superview;
    if (superParent != nil && [superParent conformsToProtocol:@protocol(RCA11yCustomFocusEffectProtocol)]) {
      id<RCA11yCustomFocusEffectProtocol> parent = (id<RCA11yCustomFocusEffectProtocol>)superParent;
      return [parent customFocusEffect];
    }

    return [super focusEffect];
  }
@end

#endif
