//
//  RCA11yRelationship.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yRelationship.h"
#import "RCA11ySortedMap.h"
#import "RCA11yDebouncer.h"

@implementation RCA11yRelationship {
  __weak UIView *_container;
  RCA11ySortedMap *_positions;
}

- (instancetype)init {
  self = [super init];
  if (self) {
    _positions = [[RCA11ySortedMap alloc] init];
  }
  return self;
}

- (void)updateAccessibilityElements {
  if (_container != nil) {
    // Empty → nil (NOT @[]). An empty `accessibilityElements` array makes VoiceOver
    // treat the container as having NO accessible elements and hides its whole
    // subtree. nil means "use the default", so an empty/own-key-less container is a
    // passthrough. This matters for KeyboardOrderFocusGroup, which renders an order
    // container on iOS that may legitimately have no items registered to its key
    // (e.g. when it wraps a nested A11y.Order whose items use the inner key).
    NSArray *values = [_positions getValues];
    [_container setAccessibilityElements:values.count > 0 ? values : nil];
  }
}

- (void)scheduleAccessibilityUpdate {
  if (self.debouncer) {
    [self.debouncer debounceAction:^{ [self updateAccessibilityElements]; }];
  } else {
    [self updateAccessibilityElements];
  }
}

- (void)add:(NSNumber *)position withObject:(NSObject *)obj {
  [_positions put:position withObject:obj];
  [self scheduleAccessibilityUpdate];
}

- (void)remove:(NSNumber *)position {
  [_positions remove:position];
  [self scheduleAccessibilityUpdate];
}

- (void)update:(NSNumber *)lastPosition withPosition:(NSNumber *)position withObject:(NSObject *)obj {
  [_positions update:lastPosition withPosition:position withObject:obj];
  [self scheduleAccessibilityUpdate];
}

- (void)setContainer:(UIView *)view {
  _container = view;
  [self updateAccessibilityElements];
}

- (void)setContainer:(UIView *)view withDebounce:(BOOL)debounced {
  if (debounced && !self.debouncer) {
    self.debouncer = [[RCA11yDebouncer alloc] initWithInterval:0.01];
  }
  [self setContainer:view];
}

- (void)clear {
  [_positions clear];
}

- (UIView *)getContainer {
  return _container;
}

- (BOOL)isEmpty {
  return [_positions isEmpty];
}

@end
