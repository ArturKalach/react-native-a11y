//
//  RCA11yHaloDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yFocusEffectUtility.h"
#import "RCA11yHaloDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTViewComponentView+RCA11y.h"
#endif

@implementation RCA11yHaloDelegate {
  UIView<RCA11yHaloProtocol> *_delegate;
  UIFocusEffect *_currentEffect;
  BOOL _isDirty;
  CGRect _prevBounds;
  CGFloat _prevRadius;
  // Last non-zero layer.cornerRadius we observed. RN's invalidateLayer toggles
  // the live cornerRadius between the styled value and 0 (its two border-render
  // paths); we pin the halo to this stable value so it stops following the 0.
  CGFloat _stableRadius;
}

- (instancetype _Nonnull)initWithView:(UIView<RCA11yHaloProtocol> *_Nonnull)delegate {
  self = [super init];
  if (self) {
    _delegate = delegate;
    _currentEffect = nil;
    _isDirty = YES;
    _prevBounds = CGRectZero;
    _prevRadius = -1;
    _stableRadius = 0;
  }
  return self;
}

- (UIFocusEffect *)focusEffect API_AVAILABLE(ios(15.0)) {
  if (_delegate.isHaloHidden) {
    return [RCA11yFocusEffectUtility emptyFocusEffect];
  }

  UIView *focusingView = [_delegate getFocusTargetView];

  // Track the view's intended corner radius, ignoring the transient 0 RN sets
  // while it draws the image-based border.
  [self observeCornerRadius:focusingView.layer.cornerRadius];

  // Explicit haloCornerRadius wins; otherwise pin to the view's stable radius.
  CGFloat cornerRadius = _delegate.haloCornerRadius > 0 ? _delegate.haloCornerRadius
                                                        : _stableRadius;

  BOOL hasCustomSettings = _delegate.haloExpendX || _delegate.haloExpendY || _delegate.haloCornerRadius;
  if (!hasCustomSettings && !_delegate.roundedHaloFix) {
    return nil;
  }

  BOOL boundsChanged = !CGRectEqualToRect(_prevBounds, focusingView.bounds);
  BOOL radiusChanged = _prevRadius != cornerRadius;

  if (_isDirty || boundsChanged || radiusChanged) {
    _isDirty = NO;
    _prevBounds = focusingView.bounds;
    _prevRadius = cornerRadius;

    _currentEffect = [RCA11yFocusEffectUtility getFocusEffect:focusingView
                                                withExpandedX:_delegate.haloExpendX
                                                withExpandedY:_delegate.haloExpendY
                                             withCornerRadius:cornerRadius];
  }

  return _currentEffect;
}

- (void)observeCornerRadius:(CGFloat)radius {
  if (radius > 0 && radius != _stableRadius) {
    _stableRadius = radius;
    _isDirty = YES;
  }
}

- (void)invalidate {
  _isDirty = YES;
}

- (void)clear {
  _currentEffect = nil;
  _isDirty = YES;
  _prevBounds = CGRectZero;
  _prevRadius = -1;
  _stableRadius = 0;
}

@end
