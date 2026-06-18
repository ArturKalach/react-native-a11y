//
//  RCA11yKbdOrderRelationship.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yKbdOrderRelationship.h"
#import "RCA11ySortedMap.h"

@implementation RCA11yKbdOrderRelationship {
  RCA11ySortedMap *_positions;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _positions = [[RCA11ySortedMap alloc] init];
  }
  return self;
}

- (void)add:(NSNumber*)position withObject:(NSObject*)obj {
  [_positions put:position withObject:obj];
}

-(void)remove:(NSNumber*)position {
  [_positions remove:position];
}

- (void)update:(NSNumber*)lastPosition withPosition:(NSNumber*)position withObject:(NSObject*)obj {
  [_positions update:lastPosition withPosition:position withObject:obj];
}

-(void)clear {
  [_positions clear];
}

- (int)getItemIndex:(UIView *)element {
  if (element == nil || ![element isKindOfClass:[UIView class]]) return -1;
  NSArray *order = [_positions getValues];
  for (int i = 0; i < (int)order.count; i++) {
    UIView *orderElement = order[i];
    if ([element isDescendantOfView:orderElement]) {
      return i;
    }
  }
  return -1;
}

- (UIView *)getItem:(int)index {
  NSArray *order = [_positions getValues];
  if (index < 0 || index >= (int)order.count) return nil;
  return order[index];
}

- (NSArray *)getArray {
  return [_positions getValues];
}

- (BOOL)isEmpty {
  return [_positions isEmpty];
}

- (int)count {
  return (int)[_positions getValues].count;
}


@end
