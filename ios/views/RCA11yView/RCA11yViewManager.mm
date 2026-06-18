//
//  RCA11yViewManager.mm
//  react-native-a11y
//

#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import "RCA11yViewManager.h"
#import "RCA11yView.h"
#import "RCTBridge.h"

@implementation RCA11yViewManager

RCT_EXPORT_MODULE(A11yView)

- (UIView *)view
{
  return [[RCA11yView alloc] init];
}

// ── Keyboard events ──────────────────────────────────────────────────────────
RCT_EXPORT_VIEW_PROPERTY(onFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContextMenuPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBubbledContextMenuPress, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyUpPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onKeyDownPress, RCTDirectEventBlock)

// ── Screen-reader events ───────────────────────────────────────────────────────
RCT_EXPORT_VIEW_PROPERTY(onScreenReaderFocused, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScreenReaderFocusChange, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScreenReaderDescendantFocusChanged, RCTDirectEventBlock)

// ── Keyboard focus / styling ───────────────────────────────────────────────────
RCT_CUSTOM_VIEW_PROPERTY(canBeFocused, BOOL, RCA11yView)
{
  BOOL value =  json ? [RCTConvert BOOL:json] : YES;
  [view setCanBeFocused: value];
}

RCT_CUSTOM_VIEW_PROPERTY(tintColor, UIColor, RCA11yView)
{
  if (json) {
    UIColor *tintColor = [RCTConvert UIColor:json];
    [view setTintColor: tintColor];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(hasOnFocusChanged, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setHasOnFocusChanged: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasKeyDownPress, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setHasOnPressDown: value];
}

RCT_CUSTOM_VIEW_PROPERTY(hasKeyUpPress, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setHasOnPressUp: value];
}

RCT_CUSTOM_VIEW_PROPERTY(autoFocus, BOOL, RCA11yView)
{
  if (json) {
    BOOL value = [RCTConvert BOOL:json];
    [view setAutoFocus: value];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(haloEffect, BOOL, RCA11yView)
{
  if(json) {
    BOOL value = [RCTConvert BOOL:json];
    if(view.isHaloHidden == value) {
      [view setIsHaloHidden: !value];
    }
  }
}

RCT_CUSTOM_VIEW_PROPERTY(screenAutoA11yFocus, BOOL, RCA11yView)
{
  //stub
}

RCT_CUSTOM_VIEW_PROPERTY(screenAutoA11yFocusDelay, int, RCA11yView)
{
  //stub
}

RCT_CUSTOM_VIEW_PROPERTY(haloCornerRadius, float, RCA11yView)
{
  if(json) {
    CGFloat value = [RCTConvert CGFloat:json];
    [view setHaloCornerRadius: value];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(haloExpendX, float, RCA11yView)
{
  if(json) {
    CGFloat value = [RCTConvert CGFloat:json];
    [view setHaloExpendX: value];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(haloExpendY, float, RCA11yView)
{
  if(json) {
    CGFloat value = [RCTConvert CGFloat:json];
    [view setHaloExpendY: value];
  }
}

RCT_CUSTOM_VIEW_PROPERTY(roundedHaloFix, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setRoundedHaloFix: value];
}

RCT_CUSTOM_VIEW_PROPERTY(groupIdentifier, NSString, RCA11yView)
{
  NSString* value = json ? [RCTConvert NSString:json] : nil;
  [view setCustomGroupId: value];
}

RCT_CUSTOM_VIEW_PROPERTY(enableContextMenu, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setEnableContextMenu: value];
}

// ── Order: discriminator + shared + per-subsystem props ────────────────────────
RCT_CUSTOM_VIEW_PROPERTY(orderType, int, RCA11yView)
{
  // Discriminator is consumed implicitly on iOS (each subsystem self-gates by its
  // own key prop: SR via orderKey, keyboard via orderGroup). No-op here.
}

// focusTarget (0 self · 1 child · 2 subview) drives both the SR focus type and the
// keyboard wrapper flag.
RCT_CUSTOM_VIEW_PROPERTY(focusTarget, int, RCA11yView)
{
  int value = json ? [RCTConvert int:json] : 0;
  [view setOrderFocusType: @(value)];
  [view setFocusableWrapper: value != 0];
}

// Shared order index → both the SR item delegate (setPosition) and the keyboard
// sequence (setOrderPosition). Each self-gates on its key prop.
RCT_CUSTOM_VIEW_PROPERTY(orderIndex, NSNumber, RCA11yView)
{
  NSNumber* value = json ? [RCTConvert NSNumber:json] : @(-1);
  [view setPosition: value];
  NSNumber* orderPosition = [value intValue] == -1 ? nil : value;
  [view setOrderPosition: orderPosition];
}

RCT_CUSTOM_VIEW_PROPERTY(orderKey, NSString, RCA11yView)
{
  NSString *value = json ? [RCTConvert NSString:json] : @"";
  [view setOrderKey: value];
}

RCT_CUSTOM_VIEW_PROPERTY(lockFocus, NSNumber, RCA11yView)
{
  if(json){
    NSNumber* value = [RCTConvert NSNumber:json];
    [view setLockFocus: value];
  }
}

RCA11yK_SIMPLE_PROP(orderGroup, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderId, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderLeft, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderRight, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderUp, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderDown, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderForward, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderBackward, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderLast, NSString, RCA11yView)
RCA11yK_SIMPLE_PROP(orderFirst, NSString, RCA11yView)

// ── Screen-reader display props ────────────────────────────────────────────────
RCT_CUSTOM_VIEW_PROPERTY(descendantFocusChangedEnabled, BOOL, RCA11yView)
{
  BOOL value = json ? [RCTConvert BOOL:json] : NO;
  [view setDescendantFocusChangedEnabled: value];
}

RCT_CUSTOM_VIEW_PROPERTY(shouldGroupAccessibilityChildren, int, RCA11yView)
{
  int value = json ? [RCTConvert int:json] : -1;
  [view setGroupChildrenMode: value];
}

RCT_CUSTOM_VIEW_PROPERTY(containerType, NSInteger, UIView)
{
  NSInteger viewContainerType = json ? [RCTConvert NSInteger:json] : 0;
  view.accessibilityContainerType = (UIAccessibilityContainerType)viewContainerType;
}

// ── Commands ───────────────────────────────────────────────────────────────────
RCT_EXPORT_METHOD(focus:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCA11yView class]]) return;
    RCA11yView *a11yView = (RCA11yView*)view;
    [a11yView focus];
    [a11yView focusView];
  }];
}

RCT_EXPORT_METHOD(keyboardFocus:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCA11yView class]]) return;
    [(RCA11yView*)view focus];
  }];
}

RCT_EXPORT_METHOD(screenReaderFocus:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
    UIView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCA11yView class]]) return;
    [(RCA11yView*)view focusView];
  }];
}

@end
