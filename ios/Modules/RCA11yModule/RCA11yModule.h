//
//  RCA11yModule.h
//  A11y
//
//  Created by Artur Kalach on 07.10.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#ifndef RCA11yModule_h
#define RCA11yModule_h

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>


@interface RCA11yModule : RCTEventEmitter <RCTBridgeModule>

extern NSString * const KEYBOARD_STATUS_EVENT;
extern NSString * const EVENT_PROP;

@end


#endif /* RCA11yModule_h */
