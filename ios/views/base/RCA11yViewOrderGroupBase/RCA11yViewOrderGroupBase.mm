//
//  RCA11yViewOrderGroupBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yViewOrderGroupBase.h"
#import "RCA11yKbdOrderLinking.h"
#import "UIViewController+RCA11y.h"
#import "UIView+React.h"
#import "RCA11yPropsHelper.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RCA11yNativeProps.h"
#endif

@interface RCA11yViewOrderGroupBase ()
@property (nonatomic, strong, readwrite) RCA11yFocusSequenceDelegate* sequenceDelegate;
@property (nonatomic, strong, readwrite) RCA11yFocusLinkDelegate* linkDelegate;
@end

@implementation RCA11yViewOrderGroupBase

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _sequenceDelegate = [[RCA11yFocusSequenceDelegate alloc] initWithView:self];
    _linkDelegate = [[RCA11yFocusLinkDelegate alloc] initWithView:self];
  }
  return self;
}

- (BOOL)getIsViewFocused:(UIFocusUpdateContext *)context {
  return context.nextFocusedView == [self getStoredView];
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
  [_linkDelegate setIsFocused:[self getIsViewFocused:context]];
  [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
}

- (void)focus {
  UIViewController *controller = self.reactViewController;
  BOOL isAttached = self.superview != nil && controller != nil;

  if (isAttached) {
    [controller rca11yFocusView:[self getStoredView]];
  }
}

- (void)cleanReferences {
  [super cleanReferences];
  [_sequenceDelegate unlink];
  [_linkDelegate unlink];

  _orderGroup = nil;
  _orderPosition = nil;
  _orderLeft = nil;
  _orderRight = nil;
  _orderUp = nil;
  _orderDown = nil;
  _orderForward = nil;
  _orderBackward = nil;
  _orderLast = nil;
  _orderFirst = nil;
  _orderId = nil;
  _lockFocus = nil;
}

- (UIView *)getFocusTargetView {
  return [self getStoredView];
}

- (void)didMoveToWindow {
  [super didMoveToWindow];
  if (self.window) {
    [_sequenceDelegate link];
    [_linkDelegate link];
  } else {
    [_sequenceDelegate unlink];
    [_linkDelegate unlink];
  }
}

- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
    BOOL hasLinkConfig = _lockFocus != nil
    || _orderId != nil
    || _orderLeft != nil || _orderRight != nil
    || _orderUp != nil   || _orderDown != nil
    || _orderForward != nil || _orderBackward != nil
    || _orderFirst != nil   || _orderLast != nil;

  if (hasLinkConfig) {
    NSNumber *linkResult = [_linkDelegate shouldUpdateFocusInContext:context];
    if (linkResult != nil) return linkResult.boolValue;
  }

  BOOL hasSequenceConfig = _orderGroup != nil && _orderPosition != nil;

  if (hasSequenceConfig) {
    NSNumber *sequenceResult = [_sequenceDelegate shouldUpdateFocusInContext:context];
    if (sequenceResult != nil) return sequenceResult.boolValue;
  }

  return [super shouldUpdateFocusInContext:context];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusOrderProps:(const RCA11y::OrderProps &)oldViewProps
                     newProps:(const RCA11y::OrderProps &)newViewProps {
  NSNumber* lockFocus = [RCA11yPropsHelper unwrapIntValue: newViewProps.lockFocus];
  if (![_lockFocus isEqual: lockFocus]) {
    [self setLockFocus: lockFocus];
  }

  NSNumber* position = [RCA11yPropsHelper unwrapIntValue: newViewProps.orderIndex];
  if (![_orderPosition isEqual: position]) {
    [self setOrderPosition: position];
  }

  NSString* orderGroup = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderGroup];
  if (![_orderGroup isEqual: orderGroup]) {
    [self setOrderGroup: orderGroup];
  }

  NSString* orderId = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderId];
  if (![_orderId isEqual: orderId]) {
    [self setOrderId: orderId];
  }

  NSString* orderLeft = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderLeft];
  if (![_orderLeft isEqual: orderLeft]) {
    [self setOrderLeft: orderLeft];
  }

  NSString* orderRight = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderRight];
  if (![_orderRight isEqual: orderRight]) {
    [self setOrderRight: orderRight];
  }

  NSString* orderUp = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderUp];
  if (![_orderUp isEqual: orderUp]) {
    [self setOrderUp: orderUp];
  }

  NSString* orderDown = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderDown];
  if (![_orderDown isEqual: orderDown]) {
    [self setOrderDown: orderDown];
  }

  NSString* orderForward = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderForward];
  if (![_orderForward isEqual: orderForward]) {
    [self setOrderForward: orderForward];
  }

  NSString* orderBackward = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderBackward];
  if (![_orderBackward isEqual: orderBackward]) {
    [self setOrderBackward: orderBackward];
  }

  NSString* orderLast = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderLast];
  if (![_orderLast isEqual: orderLast]) {
    [self setOrderLast: orderLast];
  }

  NSString* orderFirst = [RCA11yPropsHelper unwrapStringValue: newViewProps.orderFirst];
  if (![_orderFirst isEqual: orderFirst]) {
    [self setOrderFirst: orderFirst];
  }
}
#endif

- (void)setLockFocus:(NSNumber *)lockFocus {
  if ([_lockFocus isEqual:lockFocus]) return;
  _lockFocus = lockFocus;
}

- (void)setOrderGroup:(NSString *)orderGroup {
  if ([_orderGroup isEqual:orderGroup]) return;
  [_sequenceDelegate updateOrderGroup:orderGroup];
  _orderGroup = orderGroup;
}

- (void)setOrderPosition:(NSNumber *)position {
  NSNumber *newPosition = [position intValue] == -1 ? nil : position;
  if ([_orderPosition isEqual:newPosition]) return;
  [_sequenceDelegate updatePosition:newPosition];
  _orderPosition = newPosition;
}

- (void)setOrderId:(NSString *)orderId {
  if ([_orderId isEqual:orderId]) return;
  [_linkDelegate refreshId:_orderId next:orderId];
  _orderId = orderId;
}

- (void)setOrderLeft:(NSString *)orderLeft {
  if ([_orderLeft isEqual:orderLeft]) return;
  [_linkDelegate refreshLeft:orderLeft];
  _orderLeft = orderLeft;
}

- (void)setOrderRight:(NSString *)orderRight {
  if ([_orderRight isEqual:orderRight]) return;
  [_linkDelegate refreshRight:orderRight];
  _orderRight = orderRight;
}

- (void)setOrderUp:(NSString *)orderUp {
  if ([_orderUp isEqual:orderUp]) return;
  [_linkDelegate refreshUp:orderUp];
  _orderUp = orderUp;
}

- (void)setOrderDown:(NSString *)orderDown {
  if ([_orderDown isEqual:orderDown]) return;
  [_linkDelegate refreshDown:orderDown];
  _orderDown = orderDown;
}

- (void)setOrderForward:(NSString *)orderForward {
  if ([_orderForward isEqual:orderForward]) return;
  _orderForward = orderForward;
}

- (void)setOrderBackward:(NSString *)orderBackward {
  if ([_orderBackward isEqual:orderBackward]) return;
  _orderBackward = orderBackward;
}

- (void)setOrderFirst:(NSString *)orderFirst {
  if ([_orderFirst isEqual:orderFirst]) return;
  _orderFirst = orderFirst;
}

- (void)setOrderLast:(NSString *)orderLast {
  if ([_orderLast isEqual:orderLast]) return;
  _orderLast = orderLast;
}

@end
