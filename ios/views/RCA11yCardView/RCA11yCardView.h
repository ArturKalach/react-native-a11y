//
//  RCA11yCardView.h
//  react-native-a11y
//
//  Native card backing `A11y.Card` (ported from react-native-a11y-order's
//  RNAOA11yCardView).
//

#ifndef RCA11yCardView_h
#define RCA11yCardView_h

#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTViewComponentView.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCA11yCardView : RCTViewComponentView
@end

NS_ASSUME_NONNULL_END

#else

#import <React/RCTView.h>

@interface RCA11yCardView : RCTView
@end

#endif

#endif /* RCA11yCardView_h */
