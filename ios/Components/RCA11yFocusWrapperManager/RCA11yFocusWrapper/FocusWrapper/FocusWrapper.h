//
//  FocusWrapper.h
//  A11y
//
//  Created by Artur Kalach on 12.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifndef FocusWrapper_h
#define FocusWrapper_h


#import <UIKit/UIKit.h>
#import <UIKit/UIAccessibilityContainer.h>

#import <React/RCTView.h>

@interface FocusWrapper : RCTView

@property BOOL canBeFocused;
@property UIView* myPreferredFocusedView;
@property (nonatomic, copy) RCTBubblingEventBlock onFocusChange;

@end


#endif /* FocusWrapper_h */
