//
//  RCA11yFabricEventHelper.mm
//  react-native-a11y
//
#ifdef RCT_NEW_ARCH_ENABLED
#import <Foundation/Foundation.h>

#import "RCA11yFabricEventHelper.h"

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>
#import <react/renderer/components/RNA11ySpec/EventEmitters.h>
#import <react/renderer/components/RNA11ySpec/Props.h>
#import <react/renderer/components/RNA11ySpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

@implementation RCA11yFabricEventHelper

#pragma mark - Keyboard

+ (void)onKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);

        NSString* unicodeChar = [dictionary valueForKey:@"unicodeChar"];
        facebook::react::A11yViewEventEmitter::OnKeyDownPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [unicodeChar UTF8String],
        };
        viewEventEmitter->onKeyDownPress(data);
    };
}

+ (void)onKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);

        NSString* unicodeChar = [dictionary valueForKey:@"unicodeChar"];
        facebook::react::A11yViewEventEmitter::OnKeyUpPress data = {
            .keyCode = [[dictionary valueForKey:@"keyCode"] intValue],
            .isLongPress = [[dictionary valueForKey:@"isLongPress"] boolValue],
            .isAltPressed = [[dictionary valueForKey:@"isAltPressed"] boolValue],
            .isShiftPressed = [[dictionary valueForKey:@"isShiftPressed"] boolValue],
            .isCtrlPressed = [[dictionary valueForKey:@"isCtrlPressed"] boolValue],
            .isCapsLockOn = [[dictionary valueForKey:@"isCapsLockOn"] boolValue],
            .hasNoModifiers = [[dictionary valueForKey:@"hasNoModifiers"] boolValue],
            .unicode = [[dictionary valueForKey:@"unicode"] intValue],
            .unicodeChar = [unicodeChar UTF8String],
        };
        viewEventEmitter->onKeyUpPress(data);
    };
}

+ (void)onFocusChangeEventEmmiter:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
        facebook::react::A11yViewEventEmitter::OnFocusChange data = {
            .isFocused = isFocused,
        };
        viewEventEmitter->onFocusChange(data);
    };
}

+ (void)onContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
        facebook::react::A11yViewEventEmitter::OnContextMenuPress data = {};
        viewEventEmitter->onContextMenuPress(data);
    };
}

+ (void)onBubbledContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
    if (_eventEmitter) {
        auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
        facebook::react::A11yViewEventEmitter::OnBubbledContextMenuPress data = {};
        viewEventEmitter->onBubbledContextMenuPress(data);
    };
}

#pragma mark - Screen reader

+ (void)onScreenReaderFocusChange:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
  if (_eventEmitter) {
    auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
    facebook::react::A11yViewEventEmitter::OnScreenReaderFocusChange data = {
      .isFocused = isFocused,
    };
    viewEventEmitter->onScreenReaderFocusChange(data);
  };
}

+ (void)onScreenReaderFocused:(facebook::react::SharedViewEventEmitter) _eventEmitter {
  if (_eventEmitter) {
    auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
    viewEventEmitter->onScreenReaderFocused({});
  };
}

+ (void)onScreenReaderDescendantFocusChanged:(NSString*)status withId:(NSString*)nativeId withEmitter:(facebook::react::SharedViewEventEmitter) _eventEmitter {
  if (_eventEmitter) {
    auto viewEventEmitter = std::static_pointer_cast<A11yViewEventEmitter const>(_eventEmitter);
    NSString* resultID = nativeId == nil ? @"" : nativeId;
    facebook::react::A11yViewEventEmitter::OnScreenReaderDescendantFocusChanged data = {
      .status = [status UTF8String],
      .nativeId = [resultID UTF8String],
    };
    viewEventEmitter->onScreenReaderDescendantFocusChanged(data);
  };
}

@end
#endif
