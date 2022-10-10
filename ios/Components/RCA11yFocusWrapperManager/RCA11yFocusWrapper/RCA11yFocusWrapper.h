//
//  RCA11yFocusWrapper.h
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifndef RCA11yFocusWrapper_h
#define RCA11yFocusWrapper_h

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>


NS_ASSUME_NONNULL_BEGIN

@interface RCA11yFocusWrapper : RCTViewComponentView
@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@end

NS_ASSUME_NONNULL_END

#else

#import <UIKit/UIKit.h>
#import <UIKit/UIAccessibilityContainer.h>

#import <React/RCTView.h>

@interface RCA11yFocusWrapper : RCTView

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;

@end


#endif
#endif /* RCA11yFocusWrapper_h */
