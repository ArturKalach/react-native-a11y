//
//  RCA11yOrderLinking.mm
//  react-native-a11y
//
//  Screen-reader order linking (keyed by `orderKey`) — orders a container's
//  `accessibilityElements` via RCA11yRelationship/RCA11ySortedMap.
//

#import <Foundation/Foundation.h>
#import "RCA11yOrderLinking.h"
#import "RCA11yRelationship.h"

@implementation RCA11yOrderLinking {
  NSMutableDictionary<NSString *, RCA11yRelationship *> *_relationships;
}

+ (instancetype)sharedInstance {
  static RCA11yOrderLinking *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[self alloc] init];
  });
  return sharedInstance;
}

- (id)init {
  if (self = [super init]) {
    _relationships = [NSMutableDictionary dictionary];
  }
  return self;
}

- (RCA11yRelationship *)relationshipForKey:(NSString *)orderKey {
  RCA11yRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) {
    relationship = [[RCA11yRelationship alloc] init];
    _relationships[orderKey] = relationship;
  }
  return relationship;
}

- (void)add:(NSNumber *)position withOrderKey:(NSString *)orderKey withObject:(NSObject *)obj {
  [[self relationshipForKey:orderKey] add:position withObject:obj];
}

- (void)remove:(NSNumber *)position withOrderKey:(NSString *)orderKey {
  RCA11yRelationship *relationship = _relationships[orderKey];
  if (relationship == nil) return;
  [relationship remove:position];
  if ([relationship isEmpty]) {
    [_relationships removeObjectForKey:orderKey];
  }
}

- (void)setContainer:(NSString *)orderKey withView:(UIView *)view withDebounce:(BOOL)debounced {
  [[self relationshipForKey:orderKey] setContainer:view withDebounce:debounced];
}

- (void)setContainer:(NSString *)orderKey withView:(UIView *)view {
  [self setContainer:orderKey withView:view withDebounce:NO];
}

- (void)update:(NSNumber *)position lastPosition:(NSNumber *)lastPosition withOrderKey:(NSString *)orderKey withView:(UIView *)view {
  [_relationships[orderKey] update:lastPosition withPosition:position withObject:view];
}

- (void)updateOrderKey:(NSString *)prev next:(NSString *)next position:(NSNumber *)position withView:(UIView *)view {
  if (prev != nil) {
    RCA11yRelationship *old = _relationships[prev];
    [old remove:position];
    if ([old isEmpty]) {
      [_relationships removeObjectForKey:prev];
    }
  }
  if (next != nil) {
    [[self relationshipForKey:next] add:position withObject:view];
  }
}

- (void)removeContainer:(NSString *)orderKey {
  RCA11yRelationship *relationship = _relationships[orderKey];
  if (relationship != nil) {
    UIView *container = [relationship getContainer];
    [_relationships removeObjectForKey:orderKey];
    [relationship clear];
    [container setAccessibilityElements:nil];
  }
}

@end
