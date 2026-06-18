//
//  RCA11yTextInputWrapperManager.mm
//  react-native-a11y
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yTextInputWrapperManager.h"
#import "RCA11yTextInputWrapper.h"
#import "RCTBridge.h"

@implementation RCA11yTextInputWrapperManager

RCT_EXPORT_MODULE(A11yTextInputWrapper)

- (UIView *)view
{
    return [[RCA11yTextInputWrapper alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onMultiplyTextSubmit, RCTDirectEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RCA11yTextInputWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasOnFocusChanged, BOOL, RCA11yTextInputWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : NO;
    [view setHasOnFocusChanged: value];
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setCustomGroupId: value];
}

RCT_CUSTOM_VIEW_PROPERTY(blurOnSubmit, BOOL, RCA11yTextInputWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : YES;
    [view setBlurOnSubmit: value];
}

RCT_CUSTOM_VIEW_PROPERTY(multiline, BOOL, RCA11yTextInputWrapper)
{
    BOOL value =  json ? [RCTConvert BOOL:json] : NO;
    [view setMultiline: value];
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

RCT_CUSTOM_VIEW_PROPERTY(haloEffect, BOOL, RCA11yTextInputWrapper)
{
  if(json) {
    BOOL value = [RCTConvert BOOL:json];
    if(view.isHaloHidden == value) {
      [view setIsHaloHidden: !value];
    }
  }
}

RCT_CUSTOM_VIEW_PROPERTY(roundedHaloFix, BOOL, RCA11yTextInputWrapper)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setRoundedHaloFix: value];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RCA11yTextInputWrapper)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(orderGroup, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderGroup: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderIndex, NSNumber, RCA11yTextInputWrapper)
{
  if(json){
    NSNumber* value = [RCTConvert NSNumber:json];
    NSNumber* orderPosition = [value intValue] == -1 ? nil : value;
    [view setOrderPosition: orderPosition];
  }
}


RCT_CUSTOM_VIEW_PROPERTY(orderId, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderId: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderLeft, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderLeft: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderRight, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderRight: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderUp, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderUp: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderDown, NSString, RCA11yTextInputWrapper)
{
    NSString* value = json ? [RCTConvert NSString:json] : nil;
    [view setOrderDown: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderForward, NSString, RCA11yTextInputWrapper)
{
    view.orderForward = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderBackward, NSString, RCA11yTextInputWrapper)
{
    view.orderBackward = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderFirst, NSString, RCA11yTextInputWrapper)
{
    view.orderFirst = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(orderLast, NSString, RCA11yTextInputWrapper)
{
    view.orderLast = json ? [RCTConvert NSString:json] : nil;
}

RCT_CUSTOM_VIEW_PROPERTY(lockFocus, NSNumber, RCA11yTextInputWrapper)
{
    view.lockFocus = json ? [RCTConvert NSNumber:json] : nil;
}


@end
