//
//  RCA11yFocusGroup.mm
//  react-native-a11y
//

#import "RCA11yFocusGroup.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#include <string>
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"
#import <React/RCTConversions.h>

using namespace facebook::react;

@interface RCA11yFocusGroup () <RCTA11yFocusGroupViewProtocol>

@end

#endif

@implementation RCA11yFocusGroup

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _isGroupFocused = false;
#ifdef RCT_NEW_ARCH_ENABLED
        static const auto defaultProps = std::make_shared<const RCA11yFocusGroupProps>();
        _props = defaultProps;
#endif
    }

    return self;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {

    [super didUpdateFocusInContext:context withAnimationCoordinator:coordinator];
    if (@available(iOS 14.0, *)) {
        NSString* nextFocusGroup = context.nextFocusedView.focusGroupIdentifier;
        BOOL isFocused = [nextFocusGroup isEqual: _customGroupId];

        if(_isGroupFocused != isFocused){
            _isGroupFocused = isFocused;
            [self onFocusChangeHandler: isFocused];
        }
    }
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)onFocusChangeHandler:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusGroupEventEmitter const>(_eventEmitter);
        facebook::react::RCA11yFocusGroupEventEmitter::OnGroupFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onGroupFocusChange(data);
    };
}

#else
- (void)onFocusChangeHandler:(BOOL) isFocused {
    if(self.onGroupFocusChange) {
        self.onGroupFocusChange(@{ @"isFocused": @(isFocused) });
    }
}
#endif

- (void )setCustomGroupId: (NSString *) customGroupId {
    if (@available(iOS 14.0, *)) {
        _customGroupId = customGroupId;
    }
}


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yFocusGroupComponentDescriptor>();
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    self.tintColor = nil;
    _customGroupId = nil;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yFocusGroupProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yFocusGroupProps const>(props);
    [super updateProps:props oldProps:oldProps];


    UIColor* newColor = RCTUIColorFromSharedColor(newViewProps.tintColor);
    BOOL isDifferentColor = ![newColor isEqual: self.tintColor];
    BOOL renewColor = newColor != nil && self.tintColor == nil;
    BOOL isColorChanged = oldViewProps.tintColor != newViewProps.tintColor;
    if(isColorChanged || renewColor || isDifferentColor) {
        self.tintColor = newColor;
    }

    if(oldViewProps.groupIdentifier != newViewProps.groupIdentifier || !self.customGroupId) {
      if(newViewProps.groupIdentifier.empty()) {
        [self setCustomGroupId:nil];
      } else {
        NSString *newGroupId = [NSString stringWithUTF8String:newViewProps.groupIdentifier.c_str()];
        [self setCustomGroupId:newGroupId];
      }
    }
}

Class<RCTComponentViewProtocol> RCA11yFocusGroupCls(void)
{
    return RCA11yFocusGroup.class;
}


#endif



@end
