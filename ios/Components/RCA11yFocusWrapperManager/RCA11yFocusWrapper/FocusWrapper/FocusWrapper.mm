//
//  FocusWrapper.m
//  A11y
//
//  Created by Artur Kalach on 12.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "FocusWrapper.h"

@implementation FocusWrapper

- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}
- (BOOL)canBecomeFocused {
    return self.canBeFocused;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    if(!self.onFocusChange) {
        return;
    }
    
    if(context.nextFocusedView == self) {
        self.onFocusChange(@{ @"isFocused": @(YES) });
    } else if (context.previouslyFocusedView == self) {
        self.onFocusChange(@{ @"isFocused": @(NO) });
    }
}

//- (void)didUpdateReactSubviews
//{
//    [super didUpdateReactSubviews];
//    if (@available(iOS 14.0, *)) {
//        self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%@", self.reactTag];
//    }
//}

@end
