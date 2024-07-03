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
#import <React/RCTLog.h>
#import "KeyboardKeyPressHandler.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>
#import <React/RCTLog.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RCA11yFocusWrapper () <RCTRCA11yFocusWrapperViewProtocol>

@end

@implementation RCA11yFocusWrapper

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<RCA11yFocusWrapperComponentDescriptor>();
}


- (NSArray<id<UIFocusEnvironment>> *)preferredFocusEnvironments {
    if (self.myPreferredFocusedView == nil) {
        return @[];
    }
    return @[self.myPreferredFocusedView];
}
- (BOOL)canBecomeFocused {
    return self.canBeFocused;
}


- (void)onFocusChange:(BOOL) isFocused {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::RCA11yFocusWrapperEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

- (void)onKeyDownPress:(NSDictionary*) dictionary {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::RCA11yFocusWrapperEventEmitter::OnKeyDownPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
        };
        viewEventEmitter->onKeyDownPress(data);
    };
}


- (void)onKeyUpPress:(NSDictionary*) dictionary {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<RCA11yFocusWrapperEventEmitter const>(_eventEmitter);
        facebook::react::RCA11yFocusWrapperEventEmitter::OnKeyUpPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
        };
        viewEventEmitter->onKeyUpPress(data);
    };
}


- (void)didUpdateFocusInContext:(UIFocusUpdateContext *)context
       withAnimationCoordinator:(UIFocusAnimationCoordinator *)coordinator {

    if(context.nextFocusedView == self) {
        [self onFocusChange: YES];
    } else if (context.previouslyFocusedView == self) {
        [self onFocusChange: NO];
    }
}


- (instancetype)initWithFrame:(CGRect)frame
{
    
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const RCA11yFocusWrapperProps>();
        _props = defaultProps;
        _keyboardKeyPressHandler = [[KeyboardKeyPressHandler alloc] init];
    }
    
    return self;
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
    [self onKeyDownPress: eventInfo];
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
    [self onKeyUpPress: eventInfo];
}


- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(_props);
    const auto &newViewProps = *std::static_pointer_cast<RCA11yFocusWrapperProps const>(props);
    [super updateProps:props oldProps:oldProps];
    
    if(oldViewProps.canBeFocused != newViewProps.canBeFocused) {
        [self setCanBeFocused: newViewProps.canBeFocused];
    }
    
    if (@available(iOS 14.0, *)) {
        if(self.focusGroupIdentifier == nil) {
            self.focusGroupIdentifier =  [NSString stringWithFormat:@"app.group.%ld", self.tag];
        }
    }
}

Class<RCTComponentViewProtocol> RCA11yFocusWrapperCls(void)
{
    return RCA11yFocusWrapper.class;
}

@end

#else

@implementation RCA11yFocusWrapper

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        _keyboardKeyPressHandler = [[KeyboardKeyPressHandler alloc] init];
    }
    
    return self;
    
}

- (void)pressesBegan:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionDownHandler:presses withEvent:event];
    if(self.onKeyDownPress) {
        self.onKeyDownPress(eventInfo);
    }
}

- (void)pressesEnded:(NSSet<UIPress *> *)presses
           withEvent:(UIPressesEvent *)event {
    NSDictionary *eventInfo = [_keyboardKeyPressHandler actionUpHandler:presses withEvent:event];
    if(self.onKeyUpPress) {
        self.onKeyUpPress(eventInfo);
    }
}

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
