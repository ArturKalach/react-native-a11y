//
//  RCTViewComponentView+RCA11y.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCTViewComponentView+RCA11y.h"
#import "RCA11yCustomFocusEffectProtocol.h"
#import "RCA11yCustomGroupIdProtocol.h"
#import "RCA11yFocusProtocol.h"


static const NSUInteger kRCA11yMaxFocusContentDepth = 3;

static inline BOOL RCA11yIsFocusWrapper(UIView *view) {
  return [view conformsToProtocol:@protocol(RCA11yFocusProtocol)] &&
         [(id<RCA11yFocusProtocol>)view focusableWrapper];
}

static inline BOOL RCA11yIsFocusTarget(UIView *view) {
  if (RCA11yIsFocusWrapper(view.superview)) {
    return YES;
  }
  return [view conformsToProtocol:@protocol(RCA11yFocusProtocol)] &&
         ![(id<RCA11yFocusProtocol>)view focusableWrapper];
}

@implementation RCA11yViewClass (RCA11y)

- (NSString *)focusGroupIdentifier {
  if ([self.superview conformsToProtocol:@protocol(RCA11yCustomGroupIdProtocol)]) {
    id<RCA11yCustomGroupIdProtocol> parent = (id<RCA11yCustomGroupIdProtocol>)self.superview;
    NSString* groupId = [parent customGroupIdentifier];
    if(groupId != nil) {
      return groupId;
    }
  }

  return [super focusGroupIdentifier];
}


- (UIFocusEffect*)focusEffect API_AVAILABLE(ios(15.0)) {
  if ([self.superview conformsToProtocol:@protocol(RCA11yCustomFocusEffectProtocol)]) {
    id<RCA11yCustomFocusEffectProtocol> parent = (id<RCA11yCustomFocusEffectProtocol>)self.superview;
    UIFocusEffect* effect = [parent customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}

- (BOOL)canBecomeFocused {
  if ([self.superview conformsToProtocol:@protocol(RCA11yFocusProtocol)]) {
    id<RCA11yFocusProtocol> parent = (id<RCA11yFocusProtocol>)self.superview;
    if (parent.focusableWrapper) {
      return parent.canBeFocused;
    }
  }

  return [super canBecomeFocused];
}


- (BOOL)isTransparentFocusItem {
  if ([super isTransparentFocusItem]) {
    return YES;
  }

  if (@available(iOS 26.0, *)) {
    UIView *target = self.superview;
    for (NSUInteger depth = 0;
         target != nil && depth < kRCA11yMaxFocusContentDepth;
         depth++, target = target.superview) {
      if (RCA11yIsFocusTarget(target)) {
        return YES;
      }
    }
  }

  return NO;
}

@end
