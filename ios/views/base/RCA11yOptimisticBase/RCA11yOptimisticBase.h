//
//  RCA11yOptimisticBase.h
//  react-native-a11y
//
//  Optimistic accessibility-value layer (iOS-only). VoiceOver reads an element's
//  `accessibilityValue` immediately after an action (activate / increment /
//  decrement) — before React re-renders — so it announces the stale value. A view
//  carrying an `optimistic` config acts as a provider: the focused element (itself
//  in self-mode, or a descendant in wrapper-mode) consults it for the value to
//  announce during that brief window. The interception/reset swizzles live in
//  `UIView+RCA11y`; this layer just owns the config + the provider answers.
//

#ifndef RCA11yOptimisticBase_h
#define RCA11yOptimisticBase_h

#import "RCA11ySRViewOrder.h"
#import "RCA11yOptimisticProtocol.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCA11yOptimisticBase : RCA11ySRViewOrder <RCA11yOptimisticProvider>

// Optimistic config (mirrors the flattened codegen scalars). Written per-arch:
// Fabric `updateOptimisticProps` (new) or the view-manager auto-setters (old).
// `optimisticState`: 0 unset · 1 false · 2 true.
@property (nonatomic, copy, nullable) NSString *optimisticIncrease;
@property (nonatomic, copy, nullable) NSString *optimisticDecrease;
@property (nonatomic, copy, nullable) NSString *optimisticActivate;
@property (nonatomic, assign) NSInteger optimisticState;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateOptimisticProps:(const RCA11y::OptimisticProps &)oldProps
                     newProps:(const RCA11y::OptimisticProps &)newProps;
#endif

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11yOptimisticBase_h */
