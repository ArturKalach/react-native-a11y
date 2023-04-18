//
//  PaneViewManager.m
//  A11y
//
//  Created by Artur Kalach on 29.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>

@interface RCA11yPaneViewManager : RCTViewManager
@end

@implementation RCA11yPaneViewManager

RCT_EXPORT_MODULE(RCA11yPaneView)

- (UIView *)view
{
return [[UIView alloc] init];
}

@end
