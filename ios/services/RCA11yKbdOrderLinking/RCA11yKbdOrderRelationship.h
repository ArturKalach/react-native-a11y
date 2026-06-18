//
//  RCA11yKbdOrderRelationship.h
//  react-native-a11y
//
//  Keyboard sequential-order relationship (distinct from the screen-reader
//  RCA11yRelationship which orders accessibilityElements).
//

#ifndef RCA11yKbdOrderRelationship_h
#define RCA11yKbdOrderRelationship_h

#import <UIKit/UIKit.h>

@interface RCA11yKbdOrderRelationship : NSObject

@property UIView* entry;
@property UIView* exit;

- (void)add:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (NSArray*)getArray;
-(int)getItemIndex:(UIView*)element;
-(UIView*)getItem:(int)index;
-(BOOL)isEmpty;
-(int)count;

@end


#endif /* RCA11yKbdOrderRelationship_h */
