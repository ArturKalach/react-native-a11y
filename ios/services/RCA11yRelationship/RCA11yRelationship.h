//
//  RCA11yRelationship.h
//  react-native-a11y
//

#ifndef RCA11yRelationship_h
#define RCA11yRelationship_h

#import <UIKit/UIKit.h>
#include "RCA11yDebouncer.h"

@interface RCA11yRelationship : NSObject

- (void)add:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (void)setContainer:(UIView*)view;
- (void)setContainer:(UIView*)view withDebounce:(BOOL)debounced;
- (UIView*)getContainer;
- (BOOL)isEmpty;

@property (nonatomic, strong) RCA11yDebouncer *debouncer;

@end


#endif /* RCA11yRelationship_h */
