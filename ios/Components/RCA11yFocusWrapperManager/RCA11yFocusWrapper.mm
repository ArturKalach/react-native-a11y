//
//  RCA11yFocusWrapper.m
//  A11y
//
//  Created by Artur Kalach on 29.09.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yFocusWrapper.h"

#import <react/renderer/components/A11y/ComponentDescriptors.h>
#import <react/renderer/components/A11y/EventEmitters.h>
#import <react/renderer/components/A11y/Props.h>
#import <react/renderer/components/A11y/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import "RCA11yFocusWrapperImpl.h"

using namespace facebook::react;

@interface RCA11yFocusWrapper () <RCTRCA11yFocusWrapperViewProtocol>

@end

@implementation RCA11yFocusWrapper {
    View * _view;
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
        
        _view = [[View alloc] init];
        
//        self.contentView = _view;
//        _view.onFocusChange = [self](NSDictionary* dictionary) {
//            if (_eventEmitter) {
//                auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusWrapperEventEmitter const>(_eventEmitter);
//                facebook::react::RCA11yFocusWrapperEventEmitter::OnFocusChange data = {
//                    .isFocused = [[dictionary valueForKey:@"isFocused"]
//                };
//                viewEventEmitter->onLoadingStart(data);
//            }
//        };
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(props);
    
    if (oldViewProps.canBeFocused != newViewProps.canBeFocused) {
//        [_view canBeFocused: newViewProps.canBeFocused];
        print(newViewProps.canBeFocused)
    }
    
    [super updateProps:props oldProps:oldProps];
}

@end
#endif
