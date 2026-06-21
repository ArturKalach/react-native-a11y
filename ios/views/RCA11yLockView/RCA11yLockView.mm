//
//  RCA11yLockView.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "UIViewController+RCA11y.h"

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RCA11yLockView.h"

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>
#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yLockView () <RCTA11yLockViewProtocol>

@end

#endif

// componentType discriminator (mirrors JS): 0 Trap · 1 Frame.
typedef NS_ENUM(NSInteger, RCA11yLockComponentType) {
  RCA11yLockComponentTypeTrap = 0,
  RCA11yLockComponentTypeFrame = 1,
};

@implementation RCA11yLockView

- (void)didMoveToSuperview {
  [super didMoveToSuperview];

  if (self.superview) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onAccessibilityFocusChanged:)
                                                 name:UIAccessibilityElementFocusedNotification
                                               object:nil];
  } else {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIAccessibilityElementFocusedNotification
                                                  object:nil];
  }
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIAccessibilityElementFocusedNotification
                                                object:nil];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle {
  [super prepareForRecycle];
  _lockDisabled = NO;
  _forceLock = NO;
  _componentType = 0;
  _containerKey = nil;
  [[NSNotificationCenter defaultCenter] removeObserver:self
                                                  name:UIAccessibilityElementFocusedNotification
                                                object:nil];
}
#endif

// Screen-reader containment / leak detection: when focus escapes the lock, pull
// it back. Active for both Trap and Frame whenever the lock isn't disabled.
- (void)onAccessibilityFocusChanged:(NSNotification *)notification {
  if (_lockDisabled) return;

  id element = notification.userInfo[UIAccessibilityFocusedElementKey];
  if (![element isKindOfClass:[UIView class]]) return;

  UIView *focused = (UIView *)element;
  if (![focused isDescendantOfView:self]) {
    UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
  }
}

- (void)setLockDisabled:(BOOL)lockDisabled {
  _lockDisabled = lockDisabled;
  [self requestFocus];
  [self requestScreenReaderFocus];
}

- (void)setForceLock:(BOOL)forceLock {
  _forceLock = forceLock;
  [self requestFocus];
  [self requestScreenReaderFocus];
}

- (void)setComponentType:(NSInteger)componentType {
  _componentType = componentType;
}

// Keyboard containment: a Trap (or an explicit forceLock) blocks keyboard focus
// from leaving the subtree; a Frame only does leak-detection (no hard block).
- (BOOL)shouldUpdateFocusInContext:(UIFocusUpdateContext *)context {
  if (_lockDisabled) {
    return [super shouldUpdateFocusInContext:context];
  }

  BOOL containsKeyboard = _forceLock || _componentType == RCA11yLockComponentTypeTrap;
  UIView *nextFocus = (UIView *)context.nextFocusedView;
  if (containsKeyboard && nextFocus != nil && ![nextFocus isDescendantOfView:self]) {
    return NO;
  }

  return [super shouldUpdateFocusInContext:context];
}

// Keyboard focus pull-back (only when explicitly force-locking).
- (void)requestFocus {
  if (_lockDisabled || !_forceLock) return;

  UIViewController *controller = self.reactViewController;
  if (controller != nil) {
    [controller rca11yFocusView:self];
  }
}

- (void)requestScreenReaderFocus {
  if (_lockDisabled) return;
  UIAccessibilityPostNotification(UIAccessibilityLayoutChangedNotification, self);
}

- (void)didMoveToWindow {
  [super didMoveToWindow];

  if (self.window) {
    [self requestFocus];
    [self requestScreenReaderFocus];
  }
}


#ifdef RCT_NEW_ARCH_ENABLED

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RCA11yLockComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RCA11yLockProps>();
    _props = defaultProps;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps = *std::static_pointer_cast<RCA11yLockProps const>(props);
  [super updateProps:props oldProps:oldProps];

  self.componentType = newViewProps.componentType;
  self.containerKey = newViewProps.containerKey.empty()
    ? nil
    : [NSString stringWithUTF8String:newViewProps.containerKey.c_str()];
  self.forceLock = newViewProps.forceLock;
  self.lockDisabled = newViewProps.lockDisabled;
}

Class<RCTComponentViewProtocol> RCA11yLockCls(void)
{
  return RCA11yLockView.class;
}

#endif

@end
