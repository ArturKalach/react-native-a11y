//
//  RCA11ySRView.h
//  react-native-a11y
//
//  Screen-reader focus view (ported from react-native-a11y-order's
//  RNAOA11yScreenReaderView).
//

#ifndef RCA11ySRView_h
#define RCA11ySRView_h

#import "RCA11ySRViewGroup.h"
#import "RCA11yScreenReaderFocusDelegate.h"
#import "RCA11yViewItemProtocol.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCA11ySRView : RCA11ySRViewGroup<RCA11yScreenReaderFocusDelegate, RCA11yViewItemProtocol>
@end

NS_ASSUME_NONNULL_END

#endif /* RCA11ySRView_h */
