//
//  PaneView.m
//  A11y
//
//  Created by Artur Kalach on 10.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yPaneView.h"

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yPaneView () <RCTRCA11yPaneViewViewProtocol>

@end

@implementation RCA11yPaneView {
    UIView * _view;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yPaneViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCA11yPaneViewProps>();
        _props = defaultProps;
        
        _view = [[UIView alloc] init];
        
        self.contentView = _view;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<ColoredViewProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<ColoredViewProps const>(props);
    //
    //    if (oldViewProps.color != newViewProps.color) {
    //        NSString * colorToConvert = [[NSString alloc] initWithUTF8String: newViewProps.color.c_str()];
    //        [_view setBackgroundColor:[self hexStringToColor:colorToConvert]];
    //    }
    
    [super updateProps:props oldProps:oldProps];
}

Class<RCTRCA11yPaneViewViewProtocol> RCA11yPaneViewCls(void)
{
    return RCA11yPaneView.class;
}

@end
#endif
