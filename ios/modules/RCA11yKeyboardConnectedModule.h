//
//  RCA11yKeyboardConnectedModule.h
//  react-native-a11y
//
//  Physical-keyboard connection status (ported from
//  react-native-is-keyboard-connected). Emits the `keyboardStatus` event with
//  `{ status: bool }` on GameController keyboard connect/disconnect.
//

#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <RNA11ySpec/RNA11ySpec.h>

@interface RCA11yKeyboardConnectedModule : RCTEventEmitter <NativeRCA11yKeyboardConnectedModuleSpec>
#else
#import <React/RCTBridgeModule.h>

@interface RCA11yKeyboardConnectedModule : RCTEventEmitter <RCTBridgeModule>
#endif

@end
