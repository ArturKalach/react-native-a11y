//
//  RCA11yOptimisticProtocol.h
//  react-native-a11y
//
//  iOS-only "optimistic" accessibility values. VoiceOver reads an element's
//  `accessibilityValue` immediately after an action (activate / increment /
//  decrement) — before React re-renders — so it announces the stale value.
//  A view carrying an `optimistic` config acts as a provider: the focused
//  element (itself in self-mode, or a descendant in wrapper-mode) consults the
//  provider for the value to announce during that brief window.
//

#ifndef RCA11yOptimisticProtocol_h
#define RCA11yOptimisticProtocol_h

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

// Reason identifiers for an in-flight optimistic announcement.
extern NSString *const RCA11yOptimisticReasonActivate;
extern NSString *const RCA11yOptimisticReasonIncrement;
extern NSString *const RCA11yOptimisticReasonDecrement;

@protocol RCA11yOptimisticProvider <NSObject>

/** YES when this view carries an `optimistic` config worth consulting. */
- (BOOL)rca11yHasOptimisticConfig;

/**
 * The value VoiceOver should announce for `reason`, or `nil` to fall through to
 * the element's real `accessibilityValue`. `element` is the focused view (self
 * in self-mode, a descendant in wrapper-mode) — used to read traits for
 * role-aware state formatting.
 */
- (nullable NSString *)rca11yOptimisticValueForReason:(NSString *)reason
                                       focusedElement:(UIView *)element;

@end

NS_ASSUME_NONNULL_END

#endif /* RCA11yOptimisticProtocol_h */
