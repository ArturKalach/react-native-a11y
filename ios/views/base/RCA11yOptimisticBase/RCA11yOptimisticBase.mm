//
//  RCA11yOptimisticBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import <React/RCTLocalizedString.h>
#import "RCA11yOptimisticBase.h"

// UISwitchAccessibilityTrait — the private trait RN sets for `role="switch"`.
// Must match RN's `AccessibilityTraitSwitch` (React/RCTConversions.h) exactly,
// otherwise the mask never matches and switches announce "checked"/"unchecked"
// instead of "on"/"off". Used to announce switch state as "1"/"0" (spoken
// "on"/"off") rather than "checked"/"unchecked".
static const UIAccessibilityTraits RCA11ySwitchTrait = 0x20000000000001ULL;

@implementation RCA11yOptimisticBase

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateOptimisticProps:(const RCA11y::OptimisticProps &)oldProps
                     newProps:(const RCA11y::OptimisticProps &)newProps {
  self.optimisticIncrease =
      newProps.increase.empty() ? nil : [NSString stringWithUTF8String:newProps.increase.c_str()];
  self.optimisticDecrease =
      newProps.decrease.empty() ? nil : [NSString stringWithUTF8String:newProps.decrease.c_str()];
  self.optimisticActivate =
      newProps.activate.empty() ? nil : [NSString stringWithUTF8String:newProps.activate.c_str()];
  self.optimisticState = newProps.state;
}
#endif

- (void)cleanReferences {
  [super cleanReferences];
  self.optimisticIncrease = nil;
  self.optimisticDecrease = nil;
  self.optimisticActivate = nil;
  self.optimisticState = 0;
}

#pragma mark - RCA11yOptimisticProvider

- (BOOL)rca11yHasOptimisticConfig {
  return self.optimisticIncrease.length > 0 ||
         self.optimisticDecrease.length > 0 ||
         self.optimisticActivate.length > 0 ||
         self.optimisticState != 0;
}

- (NSString *)rca11yOptimisticValueForReason:(NSString *)reason
                              focusedElement:(UIView *)element {
  if ([reason isEqualToString:RCA11yOptimisticReasonIncrement]) {
    return self.optimisticIncrease.length > 0 ? self.optimisticIncrease : nil;
  }
  if ([reason isEqualToString:RCA11yOptimisticReasonDecrement]) {
    return self.optimisticDecrease.length > 0 ? self.optimisticDecrease : nil;
  }

  // activate: an explicit string wins; otherwise fall back to role-aware state.
  if (self.optimisticActivate.length > 0) {
    return self.optimisticActivate;
  }
  if (self.optimisticState != 0) {
    BOOL predictedChecked = self.optimisticState == 2;
    if ((element.accessibilityTraits & RCA11ySwitchTrait) == RCA11ySwitchTrait) {
      // VoiceOver speaks a switch's "1"/"0" value as "on"/"off" (localized).
      return predictedChecked ? @"1" : @"0";
    }
    return predictedChecked
      ? RCTLocalizedString("checked", "a checkbox, radio button, or other widget which is checked")
      : RCTLocalizedString("unchecked", "a checkbox, radio button, or other widget which is unchecked");
  }
  return nil;
}

@end
