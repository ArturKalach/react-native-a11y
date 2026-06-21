//
//  UIView+RCA11y.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "UIView+RCA11y.h"
#import "RCA11ySwizzleInstanceMethod.h"
#import "RCA11yOptimisticProtocol.h"
#import "RCA11yFocusProtocol.h"
#import <objc/runtime.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#import <react/renderer/core/Props.h>
#else
#import <React/RCTView.h>
#endif

NSString *const RCA11yOptimisticReasonActivate = @"activate";
NSString *const RCA11yOptimisticReasonIncrement = @"increment";
NSString *const RCA11yOptimisticReasonDecrement = @"decrement";

@interface RCA11yWeakWrapper : NSObject
@property (nonatomic, weak) id value;
@end

@implementation RCA11yWeakWrapper
@end

static char kRCA11yScreenReaderFocusDelegate;
static char kRCA11yOptimisticReasonKey;

@implementation UIView (RCA11y)

- (void)setScreenReaderFocusDelegate:(id<RCA11yScreenReaderFocusDelegate>)focusDelegate {
  RCA11yWeakWrapper *weakDelegate = [[RCA11yWeakWrapper alloc] init];
  [weakDelegate setValue: focusDelegate];
  objc_setAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate, weakDelegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)clearScreenReaderFocusDelegate {
  objc_setAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate, nil, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (id<RCA11yScreenReaderFocusDelegate>)getScreenReaderFocusDelegate {
  @try {
    RCA11yWeakWrapper *wrapper = objc_getAssociatedObject(self, &kRCA11yScreenReaderFocusDelegate);
    return wrapper ? wrapper.value : nil;
  } @catch (NSException *exception) {
    return nil;
  }
}

- (void)trigerScreenReaderFocusDelegate:(BOOL)focused {
  id<RCA11yScreenReaderFocusDelegate> delegate = [self getScreenReaderFocusDelegate];
  if (delegate && [delegate respondsToSelector:@selector(onScreenReaderFocusChanged:)]) {
    [delegate onScreenReaderFocusChanged: focused];
  }
}


static void RCA11yRegisterViewFocusSwizzles(void) {
  #ifdef RCT_NEW_ARCH_ENABLED
    Class swizzleClass = objc_getClass("RCTViewComponentView");
  #else
    Class swizzleClass = objc_getClass("RCTView");
  #endif
  if (!swizzleClass) return;

  RCA11ySwizzleInstanceMethod(swizzleClass,
                              @selector(accessibilityElementDidBecomeFocused),
                              @selector(rca11y_accessibilityElementDidBecomeFocused));
  RCA11ySwizzleInstanceMethod(swizzleClass,
                              @selector(accessibilityElementDidLoseFocus),
                              @selector(rca11y_accessibilityElementDidLoseFocus));

  // Optimistic accessibility-value interception.
  RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                       @selector(accessibilityActivate),
                                       @selector(rca11y_accessibilityActivate));
  RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                       @selector(accessibilityIncrement),
                                       @selector(rca11y_accessibilityIncrement));
  RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                       @selector(accessibilityDecrement),
                                       @selector(rca11y_accessibilityDecrement));
  RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                       @selector(accessibilityValue),
                                       @selector(rca11y_accessibilityValue));

  // Reset the optimistic window when React delivers the real props.
  #ifdef RCT_NEW_ARCH_ENABLED
    RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                         @selector(updateProps:oldProps:),
                                         @selector(rca11y_optimisticUpdateProps:oldProps:));
  #else
    RCA11ySwizzleInstanceMethodIfPresent(swizzleClass,
                                         @selector(didSetProps:),
                                         @selector(rca11y_optimisticDidSetProps:));
  #endif
}

RCA11y_INSTALL_SWIZZLES(RCA11yRegisterViewFocusSwizzles)

- (void)rca11y_accessibilityElementDidBecomeFocused {
  [self rca11y_accessibilityElementDidBecomeFocused];
  [self trigerScreenReaderFocusDelegate: true];
}

- (void)rca11y_accessibilityElementDidLoseFocus {
  [self rca11y_accessibilityElementDidLoseFocus];
  // Defensive bound: never carry an optimistic value across focus.
  [self rca11y_clearOptimisticReason];
  [self trigerScreenReaderFocusDelegate: false];
}

#pragma mark - Optimistic accessibility values

- (void)rca11y_setOptimisticReason:(NSString *)reason {
  objc_setAssociatedObject(self, &kRCA11yOptimisticReasonKey, reason, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

- (NSString *)rca11y_optimisticReason {
  return objc_getAssociatedObject(self, &kRCA11yOptimisticReasonKey);
}

- (void)rca11y_clearOptimisticReason {
  objc_setAssociatedObject(self, &kRCA11yOptimisticReasonKey, nil, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

// The optimistic provider for the focused element: self when it carries config
// (self-mode), otherwise its immediate A11y wrapper parent (wrapper-mode). Only
// self and the direct superview are checked — no recursive ancestor walk.
- (id<RCA11yOptimisticProvider>)rca11y_optimisticProvider {
  if ([self conformsToProtocol:@protocol(RCA11yOptimisticProvider)] &&
      [(id<RCA11yOptimisticProvider>)self rca11yHasOptimisticConfig]) {
    return (id<RCA11yOptimisticProvider>)self;
  }
  UIView *parent = self.superview;
  if ([parent conformsToProtocol:@protocol(RCA11yOptimisticProvider)] &&
      [parent conformsToProtocol:@protocol(RCA11yFocusProtocol)] &&
      [(id<RCA11yOptimisticProvider>)parent rca11yHasOptimisticConfig] &&
      [(id<RCA11yFocusProtocol>)parent focusableWrapper]) {
    return (id<RCA11yOptimisticProvider>)parent;
  }
  return nil;
}

- (BOOL)rca11y_accessibilityActivate {
  if ([self rca11y_optimisticProvider]) {
    [self rca11y_setOptimisticReason:RCA11yOptimisticReasonActivate];
  }
  return [self rca11y_accessibilityActivate];
}

- (void)rca11y_accessibilityIncrement {
  if ([self rca11y_optimisticProvider]) {
    [self rca11y_setOptimisticReason:RCA11yOptimisticReasonIncrement];
  }
  [self rca11y_accessibilityIncrement];
}

- (void)rca11y_accessibilityDecrement {
  if ([self rca11y_optimisticProvider]) {
    [self rca11y_setOptimisticReason:RCA11yOptimisticReasonDecrement];
  }
  [self rca11y_accessibilityDecrement];
}

- (NSString *)rca11y_accessibilityValue {
  NSString *reason = [self rca11y_optimisticReason];
  if (reason.length > 0) {
    id<RCA11yOptimisticProvider> provider = [self rca11y_optimisticProvider];
    NSString *optimistic = [provider rca11yOptimisticValueForReason:reason focusedElement:self];
    if (optimistic) {
      return optimistic;
    }
  }
  return [self rca11y_accessibilityValue];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)rca11y_optimisticUpdateProps:(const facebook::react::Props::Shared &)props
                            oldProps:(const facebook::react::Props::Shared &)oldProps {
  [self rca11y_optimisticUpdateProps:props oldProps:oldProps];
  // Real props arrived — the element now renders the true value.
  [self rca11y_clearOptimisticReason];
}
#else
- (void)rca11y_optimisticDidSetProps:(NSArray<NSString *> *)changedProps {
  [self rca11y_optimisticDidSetProps:changedProps];
  [self rca11y_clearOptimisticReason];
}
#endif

@end
