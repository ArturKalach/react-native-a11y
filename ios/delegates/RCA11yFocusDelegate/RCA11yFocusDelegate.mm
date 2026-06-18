//
//  RCA11yFocusDelegate.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yFocusDelegate.h"
#import "RCA11yFocusProtocol.h"
#import "RCA11yFocusEffectUtility.h"

@implementation RCA11yFocusDelegate{
  UIView<RCA11yFocusProtocol>* _delegate;
}

- (instancetype _Nonnull )initWithView:(UIView<RCA11yFocusProtocol> *_Nonnull)delegate{
  self = [super init];
  if (self) {
    _delegate = delegate;
  }
  return self;
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
  UIView* view = [self getFocusingView];
  if(context.nextFocusedView == view) {
    return @YES;
  } else if (context.previouslyFocusedView == view) {
    return @NO;
  }

  return nil;
}


@end
