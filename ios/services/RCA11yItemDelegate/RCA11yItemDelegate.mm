//
//  RCA11yItemDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yItemDelegate.h"
#import "RCA11yOrderLinking.h"

typedef NS_ENUM(NSInteger, A11yOrderType) {
  A11yOrderTypeDefault = 0,
  A11yOrderTypeChild = 1,
  A11yOrderTypeLegacy = 2,
};

@implementation RCA11yItemDelegate {
  __weak UIView<RCA11yViewItemProtocol> *_delegate;
  __weak UIView *_focusDelegateView;
  BOOL _isLinked;
}

- (instancetype _Nonnull)initWithView:(UIView<RCA11yViewItemProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _isLinked = NO;
  }
  return self;
}

#pragma mark - Prop setters

- (void)setPosition:(NSNumber *)position {
  NSNumber *lastPosition = _position;
  _position = position;
  if (lastPosition != nil && ![lastPosition isEqualToNumber:position]) {
    [self relink:position lastPosition:lastPosition];
  }
}

- (void)setOrderKey:(NSString *)orderKey {
  if ([_orderKey isEqualToString:orderKey]) return;
  NSString *prevKey = _orderKey;
  _orderKey = orderKey;
  if (_isLinked) {
    // Atomic: remove from old group and register in new group in one call.
    // _isLinked = YES guarantees _position and _linkView are non-nil.
    [[RCA11yOrderLinking sharedInstance] updateOrderKey:prevKey next:orderKey position:_position withView:_linkView];
    _isLinked = (orderKey != nil);
  } else {
    // Not yet registered — try now (handles old arch prop-arrival ordering).
    [self link];
  }
}

- (void)setOrderFocusType:(NSNumber *)orderFocusType {
  if ([_orderFocusType isEqualToNumber:orderFocusType]) return;
  _orderFocusType = orderFocusType;
  if (!_isLinked || _delegate.subviews.count == 0) return;
  UIView *newView = [self getFocusView:_delegate.subviews[0]];
  if (newView == nil || newView == _linkView) return;
  [self clear];
  [self setLinkView:newView];
}

#pragma mark - Subview lifecycle

- (void)didAddSubview:(UIView *)subview {
  if (!_linkView) {
    _isLinked = NO;
    [self setLinkView:[self getFocusView:subview]];
  }
}

- (void)willRemoveSubview:(UIView *)subview {
  if (_linkView == subview) {
    [self clear];
  }
}

- (void)finalizeUpdates {
  if (!_delegate || _delegate.subviews.count == 0) return;
  [self setLinkView:[self getFocusView:_delegate.subviews[0]]];
}

#pragma mark - Registration

- (void)setLinkView:(UIView *)view {
  if (_isLinked) return;
  _linkView = view;
  [self link];
}

- (void)link {
  if (!_delegate) return;
  if (_position && _orderKey && _linkView && !_isLinked) {
    [[RCA11yOrderLinking sharedInstance] add:_position withOrderKey:_orderKey withObject:_linkView];
    _isLinked = YES;
    [self registerFocusDelegate];
  }
}

- (void)registerFocusDelegate {
  UIView *firstAccessible = [self findFirstAccessibleChild:_delegate];
  UIView *focusView = firstAccessible ?: _linkView;
  if (focusView) {
    _focusDelegateView = focusView;
    [_delegate onFocusItemLinked:focusView];
  }
}

- (void)relink:(NSNumber *)position lastPosition:(NSNumber *)lastPosition {
  if (!_delegate || !_isLinked || !_orderKey || !position) return;
  UIView *view = _delegate.subviews.count > 0
      ? [self getFocusView:_delegate.subviews[0]]
      : _linkView;
  if (!view) return;
  [[RCA11yOrderLinking sharedInstance] update:position lastPosition:lastPosition withOrderKey:_orderKey withView:view];
}

- (void)clear {
  if (!_delegate) return;
  if (_focusDelegateView) {
    [_delegate onFocusItemRemoved:_focusDelegateView];
    _focusDelegateView = nil;
  }
  _isLinked = NO;
  if (_position && _orderKey) {
    [[RCA11yOrderLinking sharedInstance] remove:_position withOrderKey:_orderKey];
  }

  _linkView = nil;
}

#pragma mark - Focus view resolution

- (UIView *)getFocusView:(UIView *)subview {
  if (!_delegate) return nil;
  switch ([_orderFocusType intValue]) {
    case A11yOrderTypeChild:
      return [self findFirstAccessibleChild:_delegate];
    case A11yOrderTypeLegacy:
      return subview;
    case A11yOrderTypeDefault:
    default:
      return _delegate;
  }
}

- (UIView *)findFirstAccessibleChild:(UIView *)parentView {
  if (!parentView) return nil;
  for (UIView *child in parentView.subviews) {
    if ([self isAccessibleView:child]) return child;
    UIView *found = [self findFirstAccessibleChild:child];
    if (found) return found;
  }
  return nil;
}

- (BOOL)isAccessibleView:(UIView *)view {
  return view.isAccessibilityElement && !view.hidden && view.alpha > 0;
}

@end
