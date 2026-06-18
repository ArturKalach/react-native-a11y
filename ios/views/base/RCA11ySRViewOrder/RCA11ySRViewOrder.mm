//
//  RCA11ySRViewOrder.mm
//  react-native-a11y
//

#import "RCA11ySRViewOrder.h"
#import "RCA11yItemDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yFabricEventHelper.h"
#endif

@implementation RCA11ySRViewOrder {
  RCA11yItemDelegate* _a11yItemDelegate;
}

#ifdef RCT_NEW_ARCH_ENABLED

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _a11yItemDelegate = [[RCA11yItemDelegate alloc] initWithView: self];
  }
  return self;
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask {
  [super finalizeUpdates:updateMask];
  [_a11yItemDelegate finalizeUpdates];
}

- (void)prepareForRecycle {
  [_a11yItemDelegate clear];
  [super prepareForRecycle];
}

#else

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    _a11yItemDelegate = [[RCA11yItemDelegate alloc] initWithView: self];
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [_a11yItemDelegate finalizeUpdates];
}

#endif

- (void)setPosition:(NSNumber*)position {
  [_a11yItemDelegate setPosition: position];
}

- (void)setOrderKey:(NSString *)orderKey {
  [_a11yItemDelegate setOrderKey: orderKey];
}

- (void)setOrderFocusType:(NSNumber *)orderFocusType {
  [_a11yItemDelegate setOrderFocusType: orderFocusType];
}

- (nullable NSNumber*)delegatePosition {
  return _a11yItemDelegate.position;
}

- (nullable NSString*)delegateOrderKey {
  return _a11yItemDelegate.orderKey;
}

- (nullable NSNumber*)delegateOrderFocusType {
  return _a11yItemDelegate.orderFocusType;
}

- (void)onChildAttached:(UIView*)child {
  [_a11yItemDelegate didAddSubview: child];
}

- (void)willRemoveSubview:(UIView *)subview {
  [super willRemoveSubview:subview];
  [_a11yItemDelegate willRemoveSubview: subview];
}

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

@end
