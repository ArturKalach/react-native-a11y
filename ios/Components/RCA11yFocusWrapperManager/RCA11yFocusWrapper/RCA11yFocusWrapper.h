//
//  RCA11yFocusWrapper.h
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifndef RCA11yFocusWrapper_h
#define RCA11yFocusWrapper_h

#import "KeyboardKeyPressHandler.h"
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>



NS_ASSUME_NONNULL_BEGIN

@interface RCA11yFocusWrapper : RCTViewComponentView {
    KeyboardKeyPressHandler* _keyboardKeyPressHandler;
}
@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;

- (void)onFocusChange:(BOOL)isFocused;
- (void)onKeyDownPress:(NSDictionary*)dictionary;
- (void)onKeyUpPress:(NSDictionary*)dictionary;

@end

NS_ASSUME_NONNULL_END

#else

#import <UIKit/UIAccessibilityContainer.h>
#import <React/RCTView.h>

@interface RCA11yFocusWrapper : RCTView {
    KeyboardKeyPressHandler* _keyboardKeyPressHandler;
}

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyDownPress;

@end


#endif
#endif /* RCA11yFocusWrapper_h */
