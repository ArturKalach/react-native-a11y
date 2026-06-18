//
//  RCTModalHostViewComponentView+RCA11y.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11ySwizzleInstanceMethod.h"
#import <objc/runtime.h>
#import "RCA11yAnnounceService.h"
#import "RCTModalHostViewComponentView+RCA11y.h"

#ifdef RCT_NEW_ARCH_ENABLED


@implementation RCTModalHostViewComponentView (RCA11y)

static void RCA11yRegisterModalPresentationSwizzles(void) {
    Class cls = objc_getClass("RCTModalHostViewComponentView");
    if (!cls) return;
    RCA11ySwizzleInstanceMethod(cls,
              @selector(dismissViewController:animated:completion:),
              @selector(rca11yDismissViewController:animated:completion:));
    RCA11ySwizzleInstanceMethod(cls,
          @selector(presentViewController:animated:completion:),
          @selector(rca11yPresentViewController:animated:completion:));
}

RCA11y_INSTALL_SWIZZLES(RCA11yRegisterModalPresentationSwizzles)

- (void)rca11yPresentViewController:(UIViewController *)modalViewController
                        animated:(BOOL)animated
                      completion:(void (^)(void))completion
{
    [self rca11yPresentViewController:modalViewController animated:animated completion:completion];
    [[RCA11yAnnounceService shared] temporarilyLockAnnounce: 0.1];
}

- (void)rca11yDismissViewController:(UIViewController *)modalViewController
                        animated:(BOOL)animated
                      completion:(void (^)(void))completion
{
    [self rca11yDismissViewController:modalViewController animated:animated completion:completion];
    [[RCA11yAnnounceService shared] temporarilyLockAnnounce: 0.1];
}

@end

#else

@implementation RCTModalHostView (RCA11y)

static void RCA11yRegisterModalPresentationSwizzles(void) {
    Class cls = objc_getClass("RCTModalHostView");
    if (!cls) return;
    RCA11ySwizzleInstanceMethod(cls,
        @selector(ensurePresentedOnlyIfNeeded),
        @selector(rca11y_ensurePresentedOnlyIfNeeded));
    RCA11ySwizzleInstanceMethod(cls,
        @selector(dismissModalViewController),
        @selector(rca11y_dismissModalViewController));
}

RCA11y_INSTALL_SWIZZLES(RCA11yRegisterModalPresentationSwizzles)

- (void)rca11y_ensurePresentedOnlyIfNeeded
{
    [self rca11y_ensurePresentedOnlyIfNeeded];
    [[RCA11yAnnounceService shared] temporarilyLockAnnounce: 0.1];
}

- (void)rca11y_dismissModalViewController
{
    [self rca11y_dismissModalViewController];
    [[RCA11yAnnounceService shared] temporarilyLockAnnounce: 0.1];
}

@end

#endif
