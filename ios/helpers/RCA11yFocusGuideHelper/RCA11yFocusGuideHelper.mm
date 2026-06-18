//
//  RCA11yFocusGuideHelper.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>
#import "RCA11yFocusGuideHelper.h"

@implementation RCA11yFocusGuideHelper

+ (UIFocusGuide *)createGuideWithView:(UIView *)containerView focusView:(UIView *)focusView enabled:(BOOL)enabled {
    if (!containerView || !focusView) {
        return nil;
    }

    UIFocusGuide *guide = [[UIFocusGuide alloc] init];
    [containerView addLayoutGuide:guide];
    guide.preferredFocusEnvironments = @[focusView];
    guide.enabled = enabled;

    return guide;
}

+ (UIFocusGuide *)setGuideForDirection:(RCA11yFocusGuideDirection)direction
                              inView:(UIView *)containerView
                          focusView:(UIView *)focusView
                            enabled:(BOOL)enabled {
    UIFocusGuide *guide = [self createGuideWithView:containerView focusView:focusView enabled:enabled];
    if (!guide) {
        return nil;
    }

    NSArray<NSLayoutConstraint *> *constraints = nil;
    switch (direction) {
        case RCA11yFocusGuideDirectionLeft:
            constraints = @[
                [guide.topAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.widthAnchor constraintEqualToConstant:1]
            ];
            break;
        case RCA11yFocusGuideDirectionRight:
            constraints = @[
                [guide.topAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.leftAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.widthAnchor constraintEqualToConstant:1]
            ];
            break;
        case RCA11yFocusGuideDirectionUp:
            constraints = @[
                [guide.leftAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.bottomAnchor constraintEqualToAnchor:containerView.topAnchor],
                [guide.heightAnchor constraintEqualToConstant:1]
            ];
            break;
        case RCA11yFocusGuideDirectionDown:
            constraints = @[
                [guide.leftAnchor constraintEqualToAnchor:containerView.leftAnchor],
                [guide.rightAnchor constraintEqualToAnchor:containerView.rightAnchor],
                [guide.topAnchor constraintEqualToAnchor:containerView.bottomAnchor],
                [guide.heightAnchor constraintEqualToConstant:1]
            ];
            break;
        default:
            break;
    }

    if (constraints) {
        [NSLayoutConstraint activateConstraints:constraints];
    }

    return guide;
}

@end
