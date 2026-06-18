//
//  RCA11yKbdOrderLinking.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yKbdOrderLinking.h"
#import "RCA11yKbdOrderRelationship.h"

@implementation RCA11yKbdOrderLinking {
  NSMutableDictionary<NSString *, RCA11yKbdOrderRelationship *> *_relationships;
  NSMapTable<NSString *, UIView *> *_weakMap;
}

+ (instancetype)sharedInstance {
  static RCA11yKbdOrderLinking *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
    _relationships = [NSMutableDictionary dictionary];
    _weakMap = [NSMapTable strongToWeakObjectsMapTable];
  }
  return self;
}

- (RCA11yKbdOrderRelationship *)getInfo:(NSString *)orderGroup {
  return _relationships[orderGroup];
}

- (RCA11yKbdOrderRelationship *)relationshipForKey:(NSString *)orderKey {
  RCA11yKbdOrderRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) {
    relationship = [[RCA11yKbdOrderRelationship alloc] init];
    _relationships[orderKey] = relationship;
  }
  return relationship;
}

- (void)removeRelationshipIfEmpty:(RCA11yKbdOrderRelationship *)relationship forKey:(NSString *)orderKey {
  if ([relationship isEmpty]) {
    [relationship clear];
    [_relationships removeObjectForKey:orderKey];
  }
}

- (void)add:(NSNumber *)position withOrderKey:(NSString *)orderKey withObject:(NSObject *)obj {
  [[self relationshipForKey:orderKey] add:position withObject:obj];
}

- (void)remove:(NSNumber *)position withOrderKey:(NSString *)orderKey {
  RCA11yKbdOrderRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) return;
  [relationship remove:position];
  [self removeRelationshipIfEmpty:relationship forKey:orderKey];
}

- (void)update:(NSNumber *)position lastPosition:(NSNumber *)lastPosition withOrderKey:(NSString *)orderKey withView:(UIView *)view {
  [_relationships[orderKey] update:lastPosition withPosition:position withObject:view];
}

- (void)updateOrderKey:(NSString *)prev next:(NSString *)next position:(NSNumber *)position withView:(UIView *)view {
  if (prev != nil) {
    RCA11yKbdOrderRelationship *relationship = _relationships[prev];
    if (relationship != nil) {
      [relationship remove:position];
      [self removeRelationshipIfEmpty:relationship forKey:prev];
    }
  }

  if (next != nil) {
    [[self relationshipForKey:next] add:position withObject:view];
  }
}

- (void)storeOrderId:(NSString *)orderId withView:(UIView *)view {
  [_weakMap setObject:view forKey:orderId];
}

- (UIView *)getOrderView:(NSString *)orderId {
  return [_weakMap objectForKey:orderId];
}

- (void)cleanOrderId:(NSString *)orderId {
  [_weakMap removeObjectForKey:orderId];
}

@end
