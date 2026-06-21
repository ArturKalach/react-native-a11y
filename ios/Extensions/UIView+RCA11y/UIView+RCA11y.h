//
//  UIView+RCA11y.h
//  react-native-a11y
//
//  Screen-reader focus-delegate storage (ported from react-native-a11y-order's
//  UIView+RNAOA11yOrder). Declared on UIView — the delegate is attached to the
//  first accessible *child* of an A11y view, which can be any UIView subclass, so
//  these methods must live on UIView (not RCTViewComponentView). The matching
//  accessibility-focus swizzle (in this category's .mm) targets the RN host view.
//

#ifndef UIView_RCA11y_h
#define UIView_RCA11y_h

#import <UIKit/UIKit.h>
#import "RCA11yScreenReaderFocusDelegate.h"

@interface UIView (RCA11y)
- (void)setScreenReaderFocusDelegate:(id<RCA11yScreenReaderFocusDelegate>)focusDelegate;
- (void)clearScreenReaderFocusDelegate;
@end

#endif /* UIView_RCA11y_h */
