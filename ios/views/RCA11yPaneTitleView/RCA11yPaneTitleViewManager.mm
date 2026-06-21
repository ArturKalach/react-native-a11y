//
//  RCA11yPaneTitleViewManager.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yPaneTitleView.h"
#import "RCA11yPaneTitleViewManager.h"

@implementation RCA11yPaneTitleViewManager

RCT_EXPORT_MODULE(RCA11yPaneTitle)

- (UIView *)view
{
  return [[RCA11yPaneTitleView alloc] init];
}

RCT_CUSTOM_VIEW_PROPERTY(title, NSString, RCA11yPaneTitleView)
{
  NSString *value = json ? [RCTConvert NSString:json] : nil;
  [view setTitle:value];
}

RCT_CUSTOM_VIEW_PROPERTY(detachMessage, NSString, RCA11yPaneTitleView)
{
  NSString *value = json ? [RCTConvert NSString:json] : nil;
  [view setDetachMessage: value];
}

RCT_CUSTOM_VIEW_PROPERTY(withFocusRestore, BOOL, RCA11yPaneTitleView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setWithFocusRestore: value];
}

// `type` is part of the merged contract but has uniform iOS behavior; accept + ignore.
RCT_CUSTOM_VIEW_PROPERTY(type, NSInteger, RCA11yPaneTitleView)
{
  // no-op on iOS
}

@end
