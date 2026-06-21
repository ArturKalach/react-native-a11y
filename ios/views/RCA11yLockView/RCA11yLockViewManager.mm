//
//  RCA11yLockViewManager.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>
#import "RCA11yLockView.h"
#import "RCA11yLockViewManager.h"

@implementation RCA11yLockViewManager

RCT_EXPORT_MODULE(RCA11yLock)

- (UIView *)view
{
  return [[RCA11yLockView alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(componentType, NSInteger)

RCT_CUSTOM_VIEW_PROPERTY(forceLock, BOOL, RCA11yLockView)
{
  view.forceLock = json ? [RCTConvert BOOL:json] : NO;
}

RCT_CUSTOM_VIEW_PROPERTY(lockDisabled, BOOL, RCA11yLockView)
{
  view.lockDisabled = json ? [RCTConvert BOOL:json] : NO;
}

RCT_CUSTOM_VIEW_PROPERTY(containerKey, NSString, RCA11yLockView)
{
  view.containerKey = json ? [RCTConvert NSString:json] : nil;
}

@end
