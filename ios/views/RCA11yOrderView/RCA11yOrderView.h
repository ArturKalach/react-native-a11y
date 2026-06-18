//
//  RCA11yOrderView.h
//  react-native-a11y
//
//  Screen-reader order container backing `A11y.Order` (ported from
//  react-native-a11y-order's RNAOA11yOrderView).
//

#ifndef RCA11yOrderView_h
#define RCA11yOrderView_h


#import <UIKit/UIKit.h>
#import <React/RCTUITextField.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>


NS_ASSUME_NONNULL_BEGIN

@interface RCA11yOrderView : RCTViewComponentView

@property NSString* orderKey;

@end

NS_ASSUME_NONNULL_END


#else /* RCT_NEW_ARCH_ENABLED */


#import <React/RCTView.h>
@interface RCA11yOrderView : RCTView

@property NSString* orderKey;

@end


#endif /* RCT_NEW_ARCH_ENABLED */
#endif /* RCA11yOrderView_h */
