//
//  RCA11yModule.h
//  IntegratedNative
//
//  Created by Artur Kalach on 06.10.2022.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCA11yModule : RCTEventEmitter <RCTBridgeModule>

extern NSString * const KEYBOARD_STATUS_EVENT;
extern NSString * const EVENT_PROP;

@end
