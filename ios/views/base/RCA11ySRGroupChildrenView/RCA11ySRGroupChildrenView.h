//
//  RCA11ySRGroupChildrenView.h
//  react-native-a11y
//
//  shouldGroupAccessibilityChildren override (ported from react-native-a11y-order's
//  RNAOA11yGroupChildrenView).
//

#ifndef RCA11ySRGroupChildrenView_h
#define RCA11ySRGroupChildrenView_h

#import "RCA11ySRView.h"

NS_ASSUME_NONNULL_BEGIN

// groupChildrenMode: -1 = defer to super (default), 0 = NO, 1 = YES
@interface RCA11ySRGroupChildrenView : RCA11ySRView

@property (nonatomic) int groupChildrenMode;

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11ySRGroupChildrenView_h */
