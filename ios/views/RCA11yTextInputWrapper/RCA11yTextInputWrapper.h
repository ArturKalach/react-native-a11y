//
//  RCA11yTextInputWrapper.h
//  react-native-a11y
//
//  Keyboard-focus TextInput wrapper backing `A11y.Input` (ported from
//  react-native-external-keyboard's RNCEKVTextInputFocusWrapper). Reuses the merged
//  keyboard focus-change base (RCA11yViewFocusChangeBase) for focus/halo/group/order.
//

#ifndef RCA11yTextInputWrapper_h
#define RCA11yTextInputWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>
#import "RCA11yGroupIdentifierProtocol.h"
#import "RCA11yFocusOrderProtocol.h"
#import "RCA11yKeyboardFocusableProtocol.h"
#import <React/RCTUITextView.h>
#import "RCA11yViewGroupIdentifierBase.h"
#import "RCA11yViewFocusChangeBase.h"

#import <React/RCTView.h>
@interface RCA11yTextInputWrapper : RCA11yViewFocusChangeBase <RCA11yKeyboardFocusableProtocol> {
    RCTUITextField* _textField;
    RCTUITextView* _textView;
}

@property int focusType;
@property int blurType;
@property BOOL blurOnSubmit;
@property BOOL multiline;

#ifndef RCT_NEW_ARCH_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onMultiplyTextSubmit;
#endif

- (void)onMultiplyTextSubmitHandler: (RCTUITextView*) textView;
@end


#endif /* RCA11yTextInputWrapper_h */
