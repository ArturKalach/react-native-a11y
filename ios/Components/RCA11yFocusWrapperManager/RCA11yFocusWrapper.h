//
//  RCA11yFocusWrapperManager.h
//  A11y
//
//  Created by Artur Kalach on 29.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

// This guard prevent this file to be compiled in the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCA11yFocusWrapper : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#endif /* RCT_NEW_ARCH_ENABLED */
