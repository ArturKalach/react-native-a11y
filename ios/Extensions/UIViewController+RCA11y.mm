//
//  UIViewController+RCA11y.m
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 11/07/2025.
//
#ifndef UIViewController_RNCEKVExternalKeyboard_h

#import <Foundation/Foundation.h>

#import "UIViewController+RCA11y.h"
#import "RCA11ySwizzleInstanceMethod.h"
#import <objc/runtime.h>

static char kRCA11yCustomFocusViewKey;

static void RCA11yViewControllerSwizzle(void) {
    RCA11ySwizzleInstanceMethod([UIViewController class],
                                @selector(preferredFocusEnvironments),
                                @selector(rcaKeyboardedPreferredFocusEnvironments));
}

@implementation UIViewController (RCA11yFocus)

- (UIView *)customFocusView {
    return objc_getAssociatedObject(self, &kRCA11yCustomFocusViewKey);
}

- (void)setCustomFocusView:(UIView *)customFocusView {
    objc_setAssociatedObject(self, &kRCA11yCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

RCA11Y_INSTALL_SWIZZLES(RCA11yViewControllerSwizzle)

- (NSArray<id<UIFocusEnvironment>> *)rcaKeyboardedPreferredFocusEnvironments {
    NSArray<id<UIFocusEnvironment>> *originalEnvironments = [self rcaKeyboardedPreferredFocusEnvironments];

    NSMutableArray *focusEnvironments = [originalEnvironments mutableCopy];

    UIView *customFocusView = self.customFocusView;
    if (customFocusView) {
        [focusEnvironments insertObject:customFocusView atIndex:0];
    }

    return focusEnvironments;
}


@end

#endif
