//
//  RCA11yKeyboardHaloBase.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yHaloDelegate.h"
#import "RCA11yKeyboardHaloBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#endif

@implementation RCA11yKeyboardHaloBase {
  RCA11yHaloDelegate *_haloDelegate;
  // Last effect handed to the focus target. The delegate returns a pointer-stable
  // object while its inputs are unchanged, so this doubles as the change gate that
  // keeps the layout refresh from re-applying (and re-triggering layout) in a loop.
  UIFocusEffect *_lastAppliedEffect;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    _haloDelegate = [[RCA11yHaloDelegate alloc] initWithView:self];
  }

  return self;
}

- (UIFocusEffect*)customFocusEffect  API_AVAILABLE(ios(15.0)){
  return _haloDelegate.focusEffect;
}

- (UIFocusEffect*)focusEffect API_AVAILABLE(ios(15.0)) {
  // Hidden views must return our empty effect even when wrapper, or the system
  // default ring leaks through.
  if (!self.focusableWrapper || self.isHaloHidden) {
    UIFocusEffect* effect = [self customFocusEffect];
    if(effect != nil) {
      return effect;
    }
  }

  return [super focusEffect];
}

- (void)layoutSubviews {
  [super layoutSubviews];
  [self refreshHalo];
}

// Re-apply the halo after the focus target's geometry changes. UIKit only queries
// `focusEffect` at focus-update time, not on every layout, so a custom (static)
// effect would otherwise keep the bounds it had when focus arrived. The pull getter
// recomputes from current bounds; assigning it back forces UIKit to repaint.
// A `nil` effect needs no work — UIKit's own default halo already tracks the bounds.
// Default; the focus-change subclass overrides with the real focus state.
- (BOOL)isKeyboardFocused {
  return NO;
}

- (void)refreshHalo {
  // Fast path: only the focused view ever needs its halo re-applied. Bail before the
  // (relatively costly) getFocusTargetView lookup so unfocused views pay ~nothing on
  // every layout pass.
  if (![self isKeyboardFocused]) {
    return;
  }

  if (@available(iOS 15.0, *)) {
    UIView *target = [self getFocusTargetView];
    if (!target.isFocused) return;

    UIFocusEffect *effect = [self customFocusEffect];
    if (effect == _lastAppliedEffect) return;

    _lastAppliedEffect = effect;
    target.focusEffect = effect;
  }
}

// A halo prop changed: rebuild on next query and re-apply now if focused.
- (void)haloAppearanceChanged {
  [_haloDelegate invalidate];
  [self refreshHalo];
}

- (void)cleanReferences {
  [super cleanReferences];
  [_haloDelegate clear];
  _lastAppliedEffect = nil;
  _isHaloHidden = false;
  _haloExpendX = 0;
  _haloExpendY = 0;
  _haloCornerRadius = 0;
  _roundedHaloFix = false;
}

- (void)setIsHaloHidden:(BOOL)isHaloHidden {
  _isHaloHidden = isHaloHidden;
  [self haloAppearanceChanged];
}

- (void)setHaloCornerRadius:(CGFloat)haloCornerRadius {
  _haloCornerRadius = haloCornerRadius;
  [self haloAppearanceChanged];
}

- (void)setHaloExpendX:(CGFloat)haloExpendX {
  _haloExpendX = haloExpendX;
  [self haloAppearanceChanged];
}

- (void)setHaloExpendY:(CGFloat)haloExpendY {
  _haloExpendY = haloExpendY;
  [self haloAppearanceChanged];
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)updateHaloProps:(const RCA11y::HaloProps &)oldProps
               newProps:(const RCA11y::HaloProps &)newProps {
  if (_isHaloHidden == newProps.haloEffect) {
    [self setIsHaloHidden: !newProps.haloEffect];
  }

  if (oldProps.haloExpendX != newProps.haloExpendX) {
    [self setHaloExpendX:newProps.haloExpendX];
  }

  if (oldProps.haloExpendY != newProps.haloExpendY) {
    [self setHaloExpendY:newProps.haloExpendY];
  }

  if (oldProps.haloCornerRadius != newProps.haloCornerRadius) {
    [self setHaloCornerRadius:newProps.haloCornerRadius];
  }

  UIColor *newColor = RCTUIColorFromSharedColor(newProps.tintColor);
  BOOL renewColor = newColor != nil && self.tintColor == nil;
  BOOL isColorChanged = oldProps.tintColor != newProps.tintColor;
  if (isColorChanged || renewColor) {
    self.tintColor = RCTUIColorFromSharedColor(newProps.tintColor);
  }
}
#endif

@end
