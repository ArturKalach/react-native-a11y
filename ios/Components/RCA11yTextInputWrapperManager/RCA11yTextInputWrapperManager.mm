//
//  RCA11yTextInputWrapperManager.m
//  A11y
//
//  Created by Artur Kalach on 19/06/2024.
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yTextInputWrapperManager.h"
#import "RCA11yTextInputWrapper.h"
#import "RCTBridge.h"


@implementation RCA11yTextInputWrapperManager

RCT_EXPORT_MODULE(RCA11yTextInputWrapper)

- (UIView *)view
{
    return [[RCA11yTextInputWrapper alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RCA11yTextInputWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(focusType, int, RCA11yTextInputWrapper)
{
    int value =  json ? [RCTConvert int:json] : 0;
    [view setFocusType: value];
}

RCT_CUSTOM_VIEW_PROPERTY(blurType, int, RCA11yTextInputWrapper)
{
    int value =  json ? [RCTConvert int:json] : 0;
    [view setBlurType: value];
}

@end
