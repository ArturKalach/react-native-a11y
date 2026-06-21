//
//  RCA11yOrderView.mm
//  react-native-a11y
//

#import <Foundation/Foundation.h>

#import "RCA11yOrderView.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import "RCA11yOrderLinking.h"

#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yOrderView () <RCTRCA11yOrderViewProtocol>

@end

#endif



@implementation RCA11yOrderView

- (void)setOrderKey:(NSString *)orderKey {
  _orderKey = orderKey;
}

- (void)setContainer {
  if(_orderKey != nil) {
#ifdef RCT_NEW_ARCH_ENABLED
      [[RCA11yOrderLinking sharedInstance] setContainer:_orderKey withView:self];
#else
      [[RCA11yOrderLinking sharedInstance] setContainer:_orderKey withView:self withDebounce: YES];
#endif
  }
}

- (void)layoutSubviews {
    [super layoutSubviews];
    [self setContainer];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)prepareForRecycle
{
    [self setAccessibilityElements: nil];
    [super prepareForRecycle];
    [[RCA11yOrderLinking sharedInstance] removeContainer:_orderKey];
}
#else
- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    if (newSuperview == nil) {
        [[RCA11yOrderLinking sharedInstance] removeContainer:_orderKey];
    }
}
#endif


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yOrderComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCA11yOrderProps>();
        _props = defaultProps;
    }

    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yOrderProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yOrderProps const>(props);
    [super updateProps:props oldProps:oldProps];

    if(oldViewProps.orderKey != newViewProps.orderKey) {
          [self setOrderKey:  [NSString stringWithUTF8String:newViewProps.orderKey.c_str()]];
         }
}

Class<RCTComponentViewProtocol> RCA11yOrderCls(void)
{
    return RCA11yOrderView.class;
}

#endif

@end
