//
//  RCA11yView.mm
//  react-native-a11y
//

#import "RCA11yView.h"
#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>
#include <string>

#import "RCA11yPropsHelper.h"
#import "RCTFabricComponentsPlugins.h"
#import "RCA11yFabricEventHelper.h"
#import <React/RCTConversions.h>
#import <stdlib.h>
#include "RCA11yNativeProps.h"


using namespace facebook::react;

@interface RCA11yView () <RCTA11yViewViewProtocol>

@end

#endif

// orderType discriminator (mirrors JS ORDER_TYPE_VALUE): 0 auto · 1 keyboard · 2 screen-reader.
typedef NS_ENUM(NSInteger, RCA11yOrderType) {
  RCA11yOrderTypeAuto = 0,
  RCA11yOrderTypeKeyboard = 1,
  RCA11yOrderTypeScreenReader = 2,
};

@implementation RCA11yView

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
#ifdef RCT_NEW_ARCH_ENABLED
    static const auto defaultProps =
    std::make_shared<const RCA11yViewProps>();
    _props = defaultProps;
#endif
  }

  return self;
}

#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<
  RCA11yViewComponentDescriptor>();
}

- (void)prepareForRecycle {
  [super prepareForRecycle];
  [self cleanReferences];
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args {
  if ([commandName isEqual:@"focus"]) {
    // Unified handle: move both keyboard and screen-reader focus to this view.
    [self focus];
    [self focusView];
  } else if ([commandName isEqual:@"keyboardFocus"]) {
    [self focus];
  } else if ([commandName isEqual:@"screenReaderFocus"]) {
    [self focusView];
  }
}

- (void)updateProps:(Props::Shared const &)props
           oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps =
  *std::static_pointer_cast<RCA11yViewProps const>(_props);
  const auto &newViewProps =
  *std::static_pointer_cast<RCA11yViewProps const>(props);
  [super updateProps:props oldProps:oldProps];

  NSInteger orderType = newViewProps.orderType;
  BOOL screenReaderOrder = orderType != RCA11yOrderTypeKeyboard;     // auto or screen-reader
  BOOL keyboardOrder = orderType != RCA11yOrderTypeScreenReader;     // auto or keyboard

  // ── Keyboard capability slices (always applied; self-gated by their own props) ──
  [self updateKeyPressProps:RCA11y::KeyPressProps::from(oldViewProps)
                   newProps:RCA11y::KeyPressProps::from(newViewProps)];

  [self updateContextMenuProps:RCA11y::ContextMenuProps::from(oldViewProps)
                      newProps:RCA11y::ContextMenuProps::from(newViewProps)];

  [self updateFocusProps:RCA11y::FocusProps::from(oldViewProps)
                newProps:RCA11y::FocusProps::from(newViewProps)];

  [self updateGroupIdentifierProps:RCA11y::GroupIdentifierProps::from(oldViewProps)
                          newProps:RCA11y::GroupIdentifierProps::from(newViewProps)];

  [self updateHaloProps:RCA11y::HaloProps::from(oldViewProps)
               newProps:RCA11y::HaloProps::from(newViewProps)];

  [self updateFocusRequestProps:RCA11y::AutoFocusProps::from(oldViewProps)
                       newProps:RCA11y::AutoFocusProps::from(newViewProps)];

  if (keyboardOrder) {
    [self updateFocusOrderProps:RCA11y::OrderProps::from(oldViewProps)
                       newProps:RCA11y::OrderProps::from(newViewProps)];
  }

  // ── focusTarget (0 self · 1 child · 2 subview) drives BOTH the SR focus type
  //    (orderFocusType) and the keyboard wrapper flag (≠ self ⇒ wrapper). ──────────
  if (oldViewProps.focusTarget != newViewProps.focusTarget || [self delegateOrderFocusType] == nil) {
    [self setOrderFocusType: @(newViewProps.focusTarget)];
  }
  if (oldViewProps.focusTarget != newViewProps.focusTarget) {
    [self setFocusableWrapper: newViewProps.focusTarget != 0];
  }

  // ── Screen-reader capability slices ────────────────────────────────────────────
  // Only register as an SR-ordered item when there is a real positional index
  // (orderIndex >= 0, JS sends -1 as the "no order" sentinel) AND a non-empty
  // orderKey. A plain A11y.View/Pressable that merely sits inside a
  // KeyboardOrderFocusGroup inherits the group's orderKey from context but has no
  // index — it must NOT register, otherwise every such view collides on a single
  // slot (-1) under the group key and VoiceOver is left with just one focusable
  // element. With nothing registered, the group container's relationship stays
  // empty → accessibilityElements = nil → passthrough (default traversal of all cells).
  BOOL isOrderedItem = newViewProps.orderIndex >= 0 && !newViewProps.orderKey.empty();
  if (screenReaderOrder && isOrderedItem) {
    if (oldViewProps.orderIndex != newViewProps.orderIndex || [self delegatePosition] == nil) {
      [self setPosition: @(newViewProps.orderIndex)];
    }

    if (oldViewProps.orderKey != newViewProps.orderKey || [self delegateOrderKey] == nil) {
      [self setOrderKey: [NSString stringWithUTF8String:newViewProps.orderKey.c_str()]];
    }
  }

  // ── Optimistic accessibility values (iOS-only announcements) ──────────────────
  [self updateOptimisticProps:RCA11y::OptimisticProps::from(oldViewProps)
                     newProps:RCA11y::OptimisticProps::from(newViewProps)];

  if (self.groupChildrenMode != newViewProps.shouldGroupAccessibilityChildren) {
    self.groupChildrenMode = newViewProps.shouldGroupAccessibilityChildren;
  }

  if (self.descendantFocusChangedEnabled != newViewProps.descendantFocusChangedEnabled) {
    [self setDescendantFocusChangedEnabled: newViewProps.descendantFocusChangedEnabled];
  }

  if (oldViewProps.containerType != newViewProps.containerType) {
    NSInteger containerType = newViewProps.containerType;
    self.accessibilityContainerType = (UIAccessibilityContainerType)containerType;
  }
}

Class<RCTComponentViewProtocol> RCA11yViewCls(void) {
  return RCA11yView.class;
}

#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onContextMenuPressHandler {
  [RCA11yFabricEventHelper onContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onBubbledContextMenuPressHandler {
  [RCA11yFabricEventHelper onBubbledContextMenuPressEventEmmiter:_eventEmitter];
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [super onFocusChangeHandler: isFocused];
  [RCA11yFabricEventHelper onFocusChangeEventEmmiter:isFocused
                                         withEmitter:_eventEmitter];
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  [RCA11yFabricEventHelper onKeyDownPressEventEmmiter:eventInfo
                                          withEmitter:_eventEmitter];
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  [RCA11yFabricEventHelper onKeyUpPressEventEmmiter:eventInfo
                                        withEmitter:_eventEmitter];
}

#else

- (void)onContextMenuPressHandler {
  if (self.onContextMenuPress) {
    self.onContextMenuPress(@{});
  }
}

- (void)onBubbledContextMenuPressHandler {
  if (self.onBubbledContextMenuPress) {
    self.onBubbledContextMenuPress(@{});
  }
}

- (void)onFocusChangeHandler:(BOOL)isFocused {
  [super onFocusChangeHandler: isFocused];
  if (self.onFocusChange) {
    self.onFocusChange(@{@"isFocused" : @(isFocused)});
  }
}

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyDownPress) {
    self.onKeyDownPress(eventInfo);
  }
}

- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo {
  if (self.onKeyUpPress) {
    self.onKeyUpPress(eventInfo);
  }
}

#endif

@end
