//
//  RCA11ySortedMap.h
//  react-native-a11y
//

#ifndef RCA11ySortedMap_h
#define RCA11ySortedMap_h

#import <Foundation/Foundation.h>

@interface RCA11ySortedMap : NSObject

// Value memory semantics differ by subsystem (the two source packages disagreed):
//  • strong (keyboard order) — members must persist until explicitly unlinked, so a
//    still-mounted view is never dropped mid-sequence. (ext-keyboard RNCEKVSortedMap)
//  • weak   (screen-reader order) — recycled views must auto-drop so they never linger
//    in `accessibilityElements`. (a11y-order RNAOSortedMap)
// `init` defaults to weak (the SR/source default); pass strong for keyboard order.
- (instancetype)initWithStrongValues:(BOOL)strongValues;

- (void)put:(NSNumber*)position withObject:(NSObject*)obj;
- (void)remove:(NSNumber*)position;
- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj;
- (void)clear;
- (NSArray*)getValues;
- (BOOL)isEmpty;

@end

#endif /* RCA11ySortedMap_h */
