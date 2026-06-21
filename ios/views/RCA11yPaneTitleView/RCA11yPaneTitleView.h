//
//  RCA11yPaneTitleView.h
//  react-native-a11y
//
//  Pane/announcement backing `A11y.PaneTitle` / `A11y.ScreenChange` (ported from
//  react-native-a11y-order's RNAOA11yPaneTitleView).
//

#ifndef RCA11yPaneTitleView_h
#define RCA11yPaneTitleView_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RCA11yPaneTitleView : RCTViewComponentView

@property NSString* title;
@property NSString* detachMessage;
@property BOOL withFocusRestore;
@property (nonatomic, assign) BOOL hasAnnounced;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RCA11yPaneTitleView : RCTView

@property NSString* title;
@property NSString* detachMessage;
@property BOOL withFocusRestore;
@property (nonatomic, assign) BOOL hasAnnounced;

@end

#endif

#endif /* RCA11yPaneTitleView_h */
