//
//  RCA11ySRViewOrder.h
//  react-native-a11y
//
//  Screen-reader sequence ordering (ported from react-native-a11y-order's
//  RNAOA11yViewOrder). Drives the SR ordering subsystem via the item delegate
//  (position / orderKey / focusTarget).
//

#ifndef RCA11ySRViewOrder_h
#define RCA11ySRViewOrder_h

#import "RCA11ySRManagedFocusView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCA11ySRViewOrder : RCA11ySRManagedFocusView

- (void)setPosition:(NSNumber*)position;
- (void)setOrderKey:(NSString *)orderKey;
- (void)setOrderFocusType:(NSNumber *)orderFocusType;

- (nullable NSNumber*)delegatePosition;
- (nullable NSString*)delegateOrderKey;
- (nullable NSNumber*)delegateOrderFocusType;

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11ySRViewOrder_h */
