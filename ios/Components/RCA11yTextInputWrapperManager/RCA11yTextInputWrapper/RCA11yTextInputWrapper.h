//
//  RCA11yTextInputWrapper.h
//  react-native-a11y
//
//  Created by Artur Kalach on 19/06/2024.
//

#ifndef RCA11yTextInputWrapper_h
#define RCA11yTextInputWrapper_h
#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RCA11yTextInputWrapper : RCTViewComponentView{
    RCTUITextField* _textField;
}


@property BOOL canBeFocused;
@property int focusType;
@property int blurType;

- (void)onFocusChange:(BOOL)isFocused;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RCA11yTextInputWrapper : RCTView{
    RCTUITextField* _textField;
}


@property BOOL canBeFocused;
@property int focusType;
@property int blurType;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;

@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RCA11yTextInputWrapper_h */
