//
//  RCA11yOrderLinking.h
//  react-native-a11y
//

#ifndef RCA11yOrderLinking_h
#define RCA11yOrderLinking_h

#import <UIKit/UIKit.h>

@interface RCA11yOrderLinking : NSObject

+ (instancetype)sharedInstance;

- (void)add:(NSNumber*)position withOrderKey:(NSString*)orderKey withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position withOrderKey:(NSString*)orderKey;
- (void)setContainer:(NSString*)orderKey withView:(UIView*)view;
- (void)setContainer:(NSString*)orderKey withView:(UIView*)view withDebounce:(BOOL)debounced;
- (void)update:(NSNumber*)position lastPosition:(NSNumber*)lastPosition withOrderKey:(NSString*)orderKey withView:(UIView*)view;
- (void)updateOrderKey:(NSString*)prev next:(NSString*)next position:(NSNumber*)position withView:(UIView*)view;
- (void)removeContainer:(NSString*)orderKey;

@end

#endif /* RCA11yOrderLinking_h */
