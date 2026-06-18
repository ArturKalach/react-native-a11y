//
//  RCA11yKbdOrderLinking.h
//  react-native-a11y
//
//  Keyboard sequential/directional order linking (distinct from the screen-reader
//  RCA11yOrderLinking which orders accessibilityElements).
//

#ifndef RCA11yKbdOrderLinking_h
#define RCA11yKbdOrderLinking_h
#import "RCA11yKbdOrderRelationship.h"

@interface RCA11yKbdOrderLinking : NSObject

+ (instancetype)sharedInstance;

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey;
- (void)update:(NSNumber*)position lastPosition:(NSNumber*)_position withOrderKey:(NSString*)_orderKey withView:(UIView*) view;
- (void)updateOrderKey:(NSString*)prev next:(NSString*)next position:(NSNumber*)position withView:(UIView*)view;
- (RCA11yKbdOrderRelationship*)getInfo:(NSString*)orderGroup;
- (void)storeOrderId:(NSString*)orderId withView:(UIView*) view;
- (UIView*)getOrderView:(NSString*)orderId;
- (void)cleanOrderId:(NSString*)orderId;

@end

#endif /* RCA11yKbdOrderLinking_h */
