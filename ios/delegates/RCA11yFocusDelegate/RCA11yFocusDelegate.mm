//
//  RCA11yFocusDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yFocusDelegate.h"
#import "RCA11yFocusProtocol.h"

@implementation RCA11yFocusDelegate{
  UIView<RCA11yFocusProtocol>* _delegate;
  // The view UIKit actually focused inside our subtree (set from the focus engine,
  // not guessed). Weak so a removed/recycled view can't be retained or go stale.
  __weak UIView* _focusedTarget;
}

- (instancetype _Nonnull )initWithView:(UIView<RCA11yFocusProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
}

- (void)reset {
  _focusedTarget = nil;
}

// Whether `view` is the focus target THIS wrapper owns. A non-wrapper owns only
// itself. A wrapper owns a focused descendant only when it is the *nearest* wrapper
// — i.e. no other focusable wrapper sits between `view` and us — so nested wrappers
// don't both claim (and double-halo) the same focused view.
- (BOOL)ownsFocusedView:(UIView *)view {
  if (!_delegate.focusableWrapper) {
    return view == _delegate;
  }
  if (view == _delegate || ![view isDescendantOfView:_delegate]) {
    return NO;
  }
  for (UIView *v = view.superview; v && v != _delegate; v = v.superview) {
    if ([v conformsToProtocol:@protocol(RCA11yFocusProtocol)] &&
        [(id<RCA11yFocusProtocol>)v focusableWrapper]) {
      return NO; // a nearer wrapper owns it
    }
  }
  return YES;
}

- (UIView*)getFirstFocusable:(UIView*)view {
  if(view.subviews.count == 0) return nil;
  UIView* child = view.subviews[0];
  if(child.canBecomeFocused) {
    return child;
  } else {
    return [self getFirstFocusable: child];
  }
}


- (UIView *)focusingViewForGestureHandler {
    UIView *view = _delegate.subviews.firstObject;
    // Handle the special case for RNGestureHandlerButtonComponentView
    if (view && [NSStringFromClass([view class]) isEqualToString:@"RNGestureHandlerButtonComponentView"] &&
        view.subviews.count > 0) {
        return view.subviews.firstObject;
    }
    return nil;
}

- (UIView *)firstObject {
    UIView *firstChild = _delegate.subviews.firstObject;
    if (firstChild && firstChild.canBecomeFocused) {
        return firstChild;
    }
    return nil;
}

- (UIView *)getFocusingView {
    if (!_delegate.focusableWrapper) {
        return _delegate;
    }

    // Prefer the view the focus engine actually focused (correct even when it isn't
    // the first child). Only trust it while it's still inside our subtree.
    if (_focusedTarget && [_focusedTarget isDescendantOfView:_delegate]) {
        return _focusedTarget;
    }

    // Fallback before focus exists (e.g. setKeyboardFocus / focus-link setup):
    // best-effort guess at the first focusable child.
    UIView *gestureHandlerView = [self focusingViewForGestureHandler];
    if (gestureHandlerView) {
        return gestureHandlerView;
    }

    UIView *firstObject = [self firstObject];
    if (firstObject) {
        return firstObject;
    }

    return _delegate;
}

- (BOOL)canBecomeFocused {
  if(!_delegate.canBeFocused) {
    return false;
  }
  return [self getFocusingView] == _delegate;
}

- (NSNumber*)isFocusChanged:(UIFocusUpdateContext *)context {
  UIView *next = context.nextFocusedView;
  UIView *prev = context.previouslyFocusedView;

  // Focus entered our subtree: remember the *actual* focused view and report focus.
  if (next && [self ownsFocusedView:next]) {
    if (next == _focusedTarget) {
      return nil; // already tracking this view — not a change
    }
    _focusedTarget = next;
    return @YES;
  }

  // Focus left the view we were tracking.
  if (prev && prev == _focusedTarget) {
    _focusedTarget = nil;
    return @NO;
  }

  return nil;
}


@end
