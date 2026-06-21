//
//  RCA11yOrderViewManager.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yOrderView.h"
#import "RCA11yOrderViewManager.h"

@implementation RCA11yOrderViewManager

RCT_EXPORT_MODULE(RCA11yOrder)

- (UIView *)view
{
    return [[RCA11yOrderView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(orderKey, NSString, RCA11yOrderView)
{
    NSString *value = json ? [RCTConvert NSString:json] : @"";
    [view setOrderKey:value];
}

@end
