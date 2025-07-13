//
//  UIViewController+RCA11y.m
//  CocoaAsyncSocket
//
//  Created by Artur Kalach on 11/07/2025.
//
#ifndef UIViewController_RNCEKVExternalKeyboard_h

#import <Foundation/Foundation.h>

#import "UIViewController+RCA11y.h"
#import <objc/runtime.h>

static char kRCA11yCustomFocusViewKey;

@implementation UIViewController (RCA11yFocus)

- (UIView *)customFocusView {
    return objc_getAssociatedObject(self, &kRCA11yCustomFocusViewKey);
}

- (void)setCustomFocusView:(UIView *)customFocusView {
    objc_setAssociatedObject(self, &kRCA11yCustomFocusViewKey, customFocusView, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

+ (void)load
{
    static dispatch_once_t once_token;

    dispatch_once(&once_token, ^{
        method_exchangeImplementations(
                                       class_getInstanceMethod(self, @selector(preferredFocusEnvironments)),
                                       class_getInstanceMethod(self, @selector(rcaKeyboardedPreferredFocusEnvironments))
                                       );
    });
}

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
