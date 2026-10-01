//
//  RCTModalHostViewComponentView+RCA11y.h
//  react-native-a11y
//

#ifndef RCTModalHostViewComponentView_RCA11y_h
#define RCTModalHostViewComponentView_RCA11y_h

#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTModalHostViewComponentView.h>


@interface RCTModalHostViewComponentView (RCA11y)
@end

#else

#import <React/RCTModalHostView.h>

@interface RCTModalHostView (RCA11y)
@end

#endif

#endif /* RCTModalHostViewComponentView_RCA11y_h */
