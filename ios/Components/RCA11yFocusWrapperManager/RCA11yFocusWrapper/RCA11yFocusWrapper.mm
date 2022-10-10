//
//  RCA11yFocusWrapper.m
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "RCA11yFocusWrapper.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yFocusWrapper () <RCTRCA11yFocusWrapperViewProtocol>

@end

@implementation RCA11yFocusWrapper {
    UIView * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yFocusWrapperComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RCA11yFocusWrapperProps>();
    _props = defaultProps;

    _view = [[UIView alloc] init];

    self.contentView = _view;
}

return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(props);

//    if (oldViewProps.color != newViewProps.color) {
//        NSString * colorToConvert = [[NSString alloc] initWithUTF8String: newViewProps.color.c_str()];
//        [_view setBackgroundColor:[self hexStringToColor:colorToConvert]];
//    }

    [super updateProps:props oldProps:oldProps];
}

Class<RCTRCA11yFocusWrapperViewProtocol> RCA11yFocusWrapperCls(void)
{
return RCA11yFocusWrapper.class;
}


@end

#else

@implementation RCA11yFocusWrapper

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

- (void)didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (@available(iOS 14.0, *)) {
        self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%@", self.reactTag];
    }
}

@end

#endif
