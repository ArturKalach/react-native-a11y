//
//  RCA11ySRManagedFocusView.mm
//  react-native-a11y
//

#import "RCA11ySRManagedFocusView.h"
#import "RCA11yViewItemDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yFabricEventHelper.h"
#endif

@implementation RCA11ySRManagedFocusView {
  BOOL _descendantFocusChangedEnabled;
  RCA11yViewItemDelegate* _viewDelegate;
}

#ifdef RCT_NEW_ARCH_ENABLED

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _descendantFocusChangedEnabled = NO;
    _viewDelegate = [[RCA11yViewItemDelegate alloc] initWithView: self];
  }
  return self;
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  [_viewDelegate prepareForRecycle];
  // Drop the global focus subscription and forget the flag so reuse re-evaluates
  // it from props (and re-subscribes via setDescendantFocusChangedEnabled /
  // didMoveToSuperview). Recycled views may stay in the pool without a
  // removeFromSuperview, so don't rely on that to unsubscribe.
  [[RCA11yFocusService sharedService] unsubscribe:self];
  _descendantFocusChangedEnabled = NO;
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
  [super finalizeUpdates:updateMask];
  [_viewDelegate finalizeUpdates];
}

#else

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _viewDelegate = [[RCA11yViewItemDelegate alloc] initWithView: self];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [_viewDelegate layoutSubviews];
}

#endif

- (void)setDescendantFocusChangedEnabled:(BOOL)descendantFocusChangedEnabled {
  _descendantFocusChangedEnabled = descendantFocusChangedEnabled;
  if (_descendantFocusChangedEnabled) {
    if (self.superview) {
      [[RCA11yFocusService sharedService] subscribe:self];
    }
  } else {
    [[RCA11yFocusService sharedService] unsubscribe:self];
  }
}

- (BOOL)descendantFocusChangedEnabled {
  return _descendantFocusChangedEnabled;
}

// Screen-reader focus only. NOTE: unlike the standalone react-native-a11y-order
// (where `focus` aliased this), the merged view leaves `focus` to mean KEYBOARD
// focus — the keyboard order delegates invoke `focus` via RCA11yKeyboardFocusableProtocol.
// Screen-reader focus is reached through `focusView` / the `screenReaderFocus` command.
- (void)focusView {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
  });
}

- (void)didMoveToSuperview {
  [super didMoveToSuperview];
  if (_descendantFocusChangedEnabled && self.superview) {
    [[RCA11yFocusService sharedService] subscribe:self];
  }
}

- (void)removeFromSuperview {
  [[RCA11yFocusService sharedService] unsubscribe:self];
  [super removeFromSuperview];
}

- (NSString*)getNativeId:(UIView*)element {
  NSString* nativeId = nil;
  @try {
    nativeId = [element valueForKey:@"_nativeId"];
  } @catch (NSException *exception) {
    nativeId = nil;
  }
  return nativeId;
}

- (void)accessibilityElementDidBecomeFocused {
  [super accessibilityElementDidBecomeFocused];
  [self onScreenReaderFocusedHandler];
}

- (void)accessibilityElementDidBecomeFocused:(UIView*)element {
  NSString* nativeId = [self getNativeId: element];
  [self onScreenReaderDescendantFocusChangedHandler: true withId:nativeId];
}

- (void)accessibilityElementDidUnfocused:(UIView*)element {
  NSString* nativeId = [self getNativeId: element];
  [self onScreenReaderDescendantFocusChangedHandler: false withId:nativeId];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onScreenReaderFocusedHandler {
  [RCA11yFabricEventHelper onScreenReaderFocused: _eventEmitter];
}
#else
- (void)onScreenReaderFocusedHandler {
  if (self.onScreenReaderFocused) {
    self.onScreenReaderFocused(@{});
  }
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onScreenReaderDescendantFocusChangedHandler:(BOOL)isFocused withId:(NSString*)nativeId {
  NSString* status = isFocused ? @"focused" : @"blurred";
  [RCA11yFabricEventHelper onScreenReaderDescendantFocusChanged:status withId:nativeId withEmitter:_eventEmitter];
}
#else
- (void)onScreenReaderDescendantFocusChangedHandler:(BOOL)isFocused withId:(NSString*)nativeId {
  if (self.onScreenReaderDescendantFocusChanged) {
    NSString* status = isFocused ? @"focused" : @"blurred";
    self.onScreenReaderDescendantFocusChanged(@{@"status": status, @"nativeId": nativeId});
  }
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onScreenReaderFocusChangeHandler:(BOOL)isFocused {
  [RCA11yFabricEventHelper onScreenReaderFocusChange:isFocused withEmitter:_eventEmitter];
}
#else
- (void)onScreenReaderFocusChangeHandler:(BOOL)isFocused {
  if (self.onScreenReaderFocusChange) {
    self.onScreenReaderFocusChange(@{@"isFocused" : @(isFocused)});
  }
}
#endif

- (void)onChildAttached:(UIView*)child {
  [_viewDelegate didAddSubview: child];
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];
  [_viewDelegate willRemoveSubview: subview];
}

@end
