//
//  RCTKeyboardFocusWrapper.m
//  A11y
//
//  Created by Artur Kalach on 02.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RCA11yFocusWrapperManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(targetField, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(canBeFocused, BOOL)

@end
