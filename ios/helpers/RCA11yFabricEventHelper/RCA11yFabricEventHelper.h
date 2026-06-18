//
//  RCA11yFabricEventHelper.h
//  react-native-a11y
//
//  Merged Fabric event emitter helper — unifies react-native-a11y-order's
//  RNAOFabricEventHelper (screen-reader events) and react-native-external-keyboard's
//  RNCEKVFabricEventHelper (keyboard + key-press events). All events are emitted on
//  the single merged `A11yViewEventEmitter` (codegen spec RNA11ySpec).
//

#ifdef RCT_NEW_ARCH_ENABLED

#ifndef RCA11yFabricEventHelper_h
#define RCA11yFabricEventHelper_h

#import <react/renderer/components/RNA11ySpec/ComponentDescriptors.h>

using namespace facebook::react;

@interface RCA11yFabricEventHelper: NSObject

// ── Keyboard ────────────────────────────────────────────────────────────────
+ (void)onKeyDownPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onKeyUpPressEventEmmiter:(NSDictionary*) dictionary withEmitter:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onFocusChangeEventEmmiter:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onBubbledContextMenuPressEventEmmiter:(facebook::react::SharedViewEventEmitter) emitter;

// ── Screen reader ─────────────────────────────────────────────────────────────
+ (void)onScreenReaderFocusChange:(BOOL)isFocused withEmitter:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onScreenReaderFocused:(facebook::react::SharedViewEventEmitter) emitter;
+ (void)onScreenReaderDescendantFocusChanged:(NSString*)status withId:(NSString*)nativeId withEmitter:(facebook::react::SharedViewEventEmitter) emitter;

@end

#endif /* RCA11yFabricEventHelper_h */

#endif
