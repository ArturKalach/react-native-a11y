//
//  RCA11ySRViewGroup.h
//  react-native-a11y
//
//  Bottom of the screen-reader base chain (ported from react-native-a11y-order's
//  RNAOA11yViewGroup). Re-parented onto RCA11yViewKeyPress (top of the keyboard
//  chain) so the merged A11yView inherits BOTH keyboard and screen-reader bases
//  through one linear hierarchy.
//

#ifndef RCA11ySRViewGroup_h
#define RCA11ySRViewGroup_h

#import <UIKit/UIKit.h>
#import "RCA11yViewKeyPress.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCA11ySRViewGroup : RCA11yViewKeyPress

- (nullable UIView*)getSubChild;
- (void)onChildAttached:(UIView*)child;
- (void)onChildRemoved;

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11ySRViewGroup_h */
