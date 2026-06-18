//
//  RCA11yLockView.h
//  react-native-a11y
//
//  Merged focus lock backing `A11y.FocusTrap` / `A11y.FocusFrame`. Unites the
//  screen-reader lock (react-native-a11y-order's RNAOA11yLockView) and the
//  keyboard lock (react-native-external-keyboard's RNCEKVExternalKeyboardLockView)
//  into one view that contains BOTH screen-reader and physical-keyboard focus.
//
//  componentType: 0 = Trap (active containment — also blocks keyboard focus from
//  leaving) · 1 = Frame (leak detection — re-posts SR focus when it escapes).
//

#ifndef RCA11yLockView_h
#define RCA11yLockView_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCA11yLockView : RCTViewComponentView
@property (nonatomic, assign) BOOL lockDisabled;
@property (nonatomic, assign) BOOL forceLock;
@property (nonatomic, assign) NSInteger componentType;
@property (nonatomic, copy, nullable) NSString *containerKey;
@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */

#import <React/RCTView.h>
@interface RCA11yLockView : RCTView
@property (nonatomic, assign) BOOL lockDisabled;
@property (nonatomic, assign) BOOL forceLock;
@property (nonatomic, assign) NSInteger componentType;
@property (nonatomic, copy) NSString *containerKey;
@end

#endif


#endif /* RCA11yLockView_h */
