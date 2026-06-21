//
//  RCA11yFocusGroupManager.mm
//  react-native-a11y
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yFocusGroupManager.h"
#import "RCA11yFocusGroup.h"
#import "RCTBridge.h"

@implementation RCA11yFocusGroupManager

RCT_EXPORT_VIEW_PROPERTY(onGroupFocusChange, RCTDirectEventBlock)

RCT_EXPORT_MODULE(RCA11yFocusGroup)

- (UIView *)view
{
    return [[RCA11yFocusGroup alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RCA11yFocusGroup)
{
    if (json) {
        UIColor *tintColor = [RCTConvert UIColor:json];
        [view setTintColor: tintColor];
    }
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RCA11yFocusGroup)
{
   NSString* value = json ? [RCTConvert NSString:json] : nil;
   [view setCustomGroupId: value];
}

RCT_CUSTOM_VIEW_PROPERTY(orderGroup, NSString, RCA11yFocusGroup)
{
   NSString* value = json ? [RCTConvert NSString:json] : nil;
   [view setOrderGroup: value];
}



@end
