//
//  RCA11yFocusWrapperManager.m
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "RCA11yFocusWrapperManager.h"
#import "RCA11yFocusWrapper.h"

@implementation RCA11yFocusWrapperManager

RCT_EXPORT_MODULE(RCA11yFocusWrapper)

- (UIView *)view
{
    return [[RCA11yFocusWrapper alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(myPreferredFocusedView, UIView)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RCA11yFocusWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

@end
