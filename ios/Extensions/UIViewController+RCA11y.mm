//
//  UIViewController+RCA11y.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "UIViewController+RCA11y.h"
#import "RCA11ySwizzleInstanceMethod.h"
#import "RCA11yAnnounceService.h"
#import <objc/runtime.h>


static char kRca11yFocusViewRefKey;     // screen-reader: last focused view to restore
static char kRca11yFocusRestoreKey;      // screen-reader: whether restore is enabled
static char kRca11yCustomFocusViewKey;   // keyboard: preferredFocusEnvironments override

@implementation UIViewController (RCA11y)

// ─── Screen-reader focus save/restore (from RNAOA11yOrder) ──────────────────

- (void)setRca11yFocusViewRef:(UIView *)focusRef {
    objc_setAssociatedObject(self, &kRca11yFocusViewRefKey, focusRef, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (UIView *)rca11yFocusViewRef {
    return objc_getAssociatedObject(self, &kRca11yFocusViewRefKey);
}

- (void)setRca11yFocusRestore:(BOOL)focusRestore {
    objc_setAssociatedObject(self, &kRca11yFocusRestoreKey, @(focusRestore), OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (BOOL)isRca11yFocusRestore {
    return [objc_getAssociatedObject(self, &kRca11yFocusRestoreKey) boolValue];
}

// ─── Keyboard preferredFocusEnvironments override (from RNCEKVExternalKeyboard) ─

- (UIView *)rca11yCustomFocusView {
  return objc_getAssociatedObject(self, &kRca11yCustomFocusViewKey);
}

- (void)setRca11yCustomFocusView:(UIView *)customFocusView {
  objc_setAssociatedObject(self, &kRca11yCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (void)rca11yFocusView:(UIView *)view {
  self.rca11yCustomFocusView = view;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self setNeedsFocusUpdate];
    [self updateFocusIfNeeded];
  });
}

// ─── Swizzle install (single swizzle of each method) ────────────────────────

static void RCA11yRegisterViewControllerSwizzles(void) {
  Class cls = objc_getClass("UIViewController");
  if (!cls) return;
  RCA11ySwizzleInstanceMethod(cls, @selector(viewDidAppear:), @selector(rca11yViewDidAppear:));
  RCA11ySwizzleInstanceMethod(cls, @selector(viewWillDisappear:), @selector(rca11yViewWillDisappear:));
  RCA11ySwizzleInstanceMethod(cls, @selector(preferredFocusEnvironments), @selector(rca11yPreferredFocusEnvironments));
}

RCA11y_INSTALL_SWIZZLES(RCA11yRegisterViewControllerSwizzles);

// ─── Helpers ────────────────────────────────────────────────────────────────

- (void)rca11ySaveAccessibilityFocusedView {
  if (![self isRca11yFocusRestore]) return;
  id focusedElement = UIAccessibilityFocusedElement(nil);
  if (focusedElement && [focusedElement isKindOfClass:[UIView class]]) {
    [self setRca11yFocusViewRef:focusedElement];
  }
}

- (void)rca11yRestoreAccessibilityFocusedView {
  if (![self isRca11yFocusRestore]) return;
  id viewToFocus = [self rca11yFocusViewRef];
  if (viewToFocus) {
    UIAccessibilityPostNotification(UIAccessibilityScreenChangedNotification, viewToFocus);
    [self setRca11yFocusViewRef:nil];
  }
}

- (BOOL)rca11yIgnoredControllers {
  NSString *className = NSStringFromClass([self class]);
  NSArray *ignoredClassNames = @[
      @"UICompatibilityInputViewController",
      @"UISystemInputAssistantViewController",
      @"UIInputWindowController",
      @"UIPredictionViewController"
  ];
  return [ignoredClassNames containsObject:className];
}

// ─── Swizzled methods (do both SR + keyboard work) ──────────────────────────

- (void)rca11yViewDidAppear:(BOOL)animated {
  if ([self rca11yIgnoredControllers]) {
    [self rca11yViewDidAppear:animated];
    return;
  }

  [self rca11yViewDidAppear:animated];           // original
  [self rca11yRestoreAccessibilityFocusedView];  // screen reader
  [[RCA11yAnnounceService shared] temporarilyLockAnnounce:0.5];
  // keyboard: notify focus-link observers a controller appeared
  [[NSNotificationCenter defaultCenter] postNotificationName:@"ViewControllerChangedNotification" object:self];
}

- (void)rca11yViewWillDisappear:(BOOL)animated {
  if ([self rca11yIgnoredControllers]) {
    [self rca11yViewWillDisappear:animated];
    return;
  }

  [[RCA11yAnnounceService shared] temporarilyLockAnnounce:1];
  [self rca11yViewWillDisappear:animated];       // original
  [self rca11ySaveAccessibilityFocusedView];     // screen reader
}

- (NSArray<id<UIFocusEnvironment>> *)rca11yPreferredFocusEnvironments {
  NSArray<id<UIFocusEnvironment>> *originalEnvironments = [self rca11yPreferredFocusEnvironments];

  UIView *customFocusView = self.rca11yCustomFocusView;
  if (customFocusView) {
    NSMutableArray *focusEnvironments = [originalEnvironments mutableCopy];
    [focusEnvironments insertObject:customFocusView atIndex:0];
    return focusEnvironments;
  }

  return originalEnvironments;
}

@end
