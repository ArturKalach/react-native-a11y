//
//  RCA11yFocusLinkDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yFocusLinkDelegate.h"
#import "RCA11yFocusGuideHelper.h"
#import "RCA11yFocusLinkObserver.h"
#import "RCA11yOrderSubscriber.h"
#import "RCA11yKbdOrderLinking.h"
#import "RCA11yKeyboardFocusableProtocol.h"

static NSNumber *const FOCUS_DEFAULT = nil;
static NSNumber *const FOCUS_LOCK = @0;
static NSNumber *const FOCUS_HANDLED = @0;

@implementation RCA11yFocusLinkDelegate {
  BOOL _isFocused;
  UIView<RCA11yFocusOrderProtocol> *_delegate;
  NSMutableDictionary<NSNumber *, UIFocusGuide *> *_sides;
  NSMutableDictionary<NSNumber *, RCA11yOrderSubscriber *> *_subscribers;
}

- (instancetype)initWithView:(UIView<RCA11yFocusOrderProtocol> *)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isFocused = NO;
    _sides = [NSMutableDictionary dictionary];
    _subscribers = [NSMutableDictionary dictionary];
  }
  return self;
}

- (void)link {
  if (_delegate.orderId != nil) {
    [[RCA11yKbdOrderLinking sharedInstance] storeOrderId:_delegate.orderId withView:_delegate];
    [self linkId];
  }
}

- (void)unlink {
  if (_delegate.orderId != nil) {
    [[RCA11yKbdOrderLinking sharedInstance] cleanOrderId:_delegate.orderId];
    [self clear];
  }
}

#pragma mark - Focus helpers

- (void)keyboardedViewFocus:(UIView *)view {
  if ([view conformsToProtocol:@protocol(RCA11yKeyboardFocusableProtocol)]) {
    [(UIView<RCA11yKeyboardFocusableProtocol> *)view focus];
  }
}

#pragma mark - Guide management

- (void)setGuideFor:(RCA11yFocusGuideDirection)direction withView:(UIView *)view {
  if (!view) return;
  [self removeGuideFor:direction];
  _sides[@(direction)] = [RCA11yFocusGuideHelper setGuideForDirection:direction
                                                               inView:_delegate
                                                           focusView:view
                                                             enabled:_isFocused];
}

- (void)removeGuideFor:(RCA11yFocusGuideDirection)direction {
  if (_sides[@(direction)]) {
    [_delegate removeLayoutGuide:_sides[@(direction)]];
    _sides[@(direction)] = nil;
  }
}

- (void)setIsFocused:(BOOL)value {
  _isFocused = value;
  for (NSNumber *key in _sides) {
    _sides[key].enabled = value;
  }
}

#pragma mark - Subscriptions

- (void)subscribeToDirection:(RCA11yFocusGuideDirection)direction linkId:(NSString *)linkId {
  if (!linkId) return;

  if (_subscribers[@(direction)]) {
    [self clearDirection:direction];
  }

  RCA11yFocusGuideDirection capturedDirection = direction;

  LinkUpdatedCallback onLinkUpdated = ^(UIView *link) {
    [self setGuideFor:capturedDirection withView:link];
  };

  LinkRemovedCallback onLinkRemoved = ^{
    [self removeGuideFor:capturedDirection];
  };

  RCA11yOrderSubscriber *subscriber = [[RCA11yFocusLinkObserver sharedManager] subscribe:linkId
                                                                           onLinkUpdated:onLinkUpdated
                                                                           onLinkRemoved:onLinkRemoved];
  _subscribers[@(direction)] = subscriber;
}

- (void)clearDirection:(RCA11yFocusGuideDirection)direction {
  if (!_subscribers[@(direction)]) return;
  [[RCA11yFocusLinkObserver sharedManager] unsubscribe:_subscribers[@(direction)]];
  _subscribers[@(direction)] = nil;
  [self removeGuideFor:direction];
}

- (void)refreshDirection:(RCA11yFocusGuideDirection)direction nextId:(NSString *)nextId {
  [self clearDirection:direction];
  [self subscribeToDirection:direction linkId:nextId];
}

#pragma mark - Public API

- (void)linkId {
  RCA11yFocusLinkObserver *focusLinkObserver = [RCA11yFocusLinkObserver sharedManager];
  NSString *orderId = _delegate.orderId;
  UIView *view = [_delegate getFocusTargetView];

  if (orderId != nil) {
    [focusLinkObserver emitWithId:orderId link:view];
  }

  [self subscribeToDirection:RCA11yFocusGuideDirectionLeft  linkId:_delegate.orderLeft];
  [self subscribeToDirection:RCA11yFocusGuideDirectionRight linkId:_delegate.orderRight];
  [self subscribeToDirection:RCA11yFocusGuideDirectionUp    linkId:_delegate.orderUp];
  [self subscribeToDirection:RCA11yFocusGuideDirectionDown  linkId:_delegate.orderDown];
}

- (void)refreshId:(NSString *)prev next:(NSString *)next {
  RCA11yFocusLinkObserver *focusLinkObserver = [RCA11yFocusLinkObserver sharedManager];
  UIView *view = [_delegate getFocusTargetView];

  if (prev != nil) {
    [focusLinkObserver emitRemoveWithId:prev];
    [[RCA11yKbdOrderLinking sharedInstance] cleanOrderId:prev];
  }

  if (next != nil && view != nil) {
    [[RCA11yKbdOrderLinking sharedInstance] storeOrderId:next withView:_delegate];
    [focusLinkObserver emitWithId:next link:view];
  }
}

- (void)refreshLeft:(NSString *)next  { [self refreshDirection:RCA11yFocusGuideDirectionLeft  nextId:next]; }
- (void)refreshRight:(NSString *)next { [self refreshDirection:RCA11yFocusGuideDirectionRight nextId:next]; }
- (void)refreshUp:(NSString *)next    { [self refreshDirection:RCA11yFocusGuideDirectionUp    nextId:next]; }
- (void)refreshDown:(NSString *)next  { [self refreshDirection:RCA11yFocusGuideDirectionDown  nextId:next]; }

- (void)clear {
  [self clearDirection:RCA11yFocusGuideDirectionLeft];
  [self clearDirection:RCA11yFocusGuideDirectionRight];
  [self clearDirection:RCA11yFocusGuideDirectionUp];
  [self clearDirection:RCA11yFocusGuideDirectionDown];
  [self refreshId:_delegate.orderId next:nil];
}

- (NSNumber *)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  UIFocusHeading movementHint = context.focusHeading;
  UIView *current = (UIView *)context.previouslyFocusedItem;
  UIView *targetView = [_delegate getFocusTargetView];

  BOOL isCurrentDelegate = current != nil
    && [current isKindOfClass:[UIView class]]
    && (current == targetView || [current isDescendantOfView:_delegate]);
  if (isCurrentDelegate) {
    NSUInteger rawFocusLockValue = [_delegate.lockFocus unsignedIntegerValue];
    if ((rawFocusLockValue & movementHint) != 0) {
      return FOCUS_LOCK;
    }

    NSString *orderId = nil;
    if (movementHint == UIFocusHeadingLast)          orderId = _delegate.orderLast;
    else if (movementHint == UIFocusHeadingFirst)    orderId = _delegate.orderFirst;
    else if (movementHint == UIFocusHeadingNext)     orderId = _delegate.orderForward;
    else if (movementHint == UIFocusHeadingPrevious) orderId = _delegate.orderBackward;

    if (orderId) {
      UIView *nextView = [[RCA11yKbdOrderLinking sharedInstance] getOrderView:orderId];
      [self keyboardedViewFocus:nextView];
      return FOCUS_HANDLED;
    }
  }

  return FOCUS_DEFAULT;
}

@end
