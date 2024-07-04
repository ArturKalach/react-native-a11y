//
//  RCA11yTextInputWrapper.m
//  A11y
//
//  Created by Artur Kalach on 19/06/2024.
//

#import <Foundation/Foundation.h>

#import "RCA11yTextInputWrapper.h"
#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>
#import <React/RCTLog.h>
#import <React/RCTUITextField.h>


#ifdef RCT_NEW_ARCH_ENABLED

#include <string>
#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

#import "RCTFabricComponentsPlugins.h"

#endif


static const NSInteger AUTO_FOCUS = 2;
static const NSInteger AUTO_BLUR = 2;

#ifdef RCT_NEW_ARCH_ENABLED
using namespace facebook::react;

@interface RCA11yTextInputWrapper () <RCTRCA11yTextInputWrapperViewProtocol>

@end

#endif

@implementation RCA11yTextInputWrapper


#ifdef RCT_NEW_ARCH_ENABLED
+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yTextInputWrapperComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCA11yTextInputWrapperProps>();
        _props = defaultProps;
    }
    
    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yTextInputWrapperProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yTextInputWrapperProps const>(props);
    [super updateProps
     :props oldProps:oldProps];
    
    if(oldViewProps.canBeFocused != newViewProps.canBeFocused) {
        [self setCanBeFocused: newViewProps.canBeFocused];
    }
    
    if(oldViewProps.focusType != newViewProps.focusType) {
        [self setFocusType: newViewProps.focusType];
    }
    
    if(oldViewProps.blurType != newViewProps.blurType) {
        [self setBlurType: newViewProps.blurType];
    }
    
    if (@available(iOS 14.0, *)) {
        if(self.focusGroupIdentifier == nil) {
            self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%ld", self.tag];
        }
    }
}

Class<RCTComponentViewProtocol> RCA11yTextInputWrapperCls(void)
{
    return RCA11yTextInputWrapper.class;
}

#else

- (void)didUpdateReactSubviews
{
    [super didUpdateReactSubviews];
    if (@available(iOS 14.0, *)) {
        self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%@", self.reactTag];
    }
}

#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)onFocusChange:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::RCA11yFocusWrapperEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}
#else

- (void)onFocusChange:(BOOL) isFocused {
    if(self.onFocusChange) {
        self.onFocusChange(@{ @"isFocused": @(isFocused) });
    }
}

#endif


- (BOOL)canBecomeFocused {
    return self.canBeFocused;
}

- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {
    BOOL isTextInputFocus = [context.nextFocusedView isKindOfClass: [RCTUITextField class]];
    if(isTextInputFocus && (_textField == nil || _textField == context.nextFocusedView)) {
        [self onFocusChange: YES];
        BOOL isTextInputFocus = [context.nextFocusedView isKindOfClass: [RCTUITextField class]];
        
        if(_textField == nil) {
            _textField = (RCTUITextField *)context.nextFocusedView;
        }
        if(self.focusType == AUTO_FOCUS) {
            [_textField reactFocus];
        }
    } else if (context.previouslyFocusedView == _textField) {
        [self onFocusChange: NO];
        if(self.blurType == AUTO_BLUR) {
            [_textField reactBlur];
        }
    }
}


- (void)willMoveToSuperview:(UIView *)newSuperview {
    [super willMoveToSuperview:newSuperview];
    
    if (newSuperview == nil) {
        _textField = nil;
    }
}


@end
