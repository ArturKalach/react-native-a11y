//
//  RCA11yViewOrderGroupBase.h
//  react-native-a11y
//
//  Keyboard index-order + directional-link group (ported from EK
//  RNCEKVViewOrderGroupBase). Drives the keyboard ordering subsystem via the
//  sequence delegate (orderGroup/orderPosition) and link delegate (orderId/links).
//

#ifndef RCA11yViewOrderGroupBase_h
#define RCA11yViewOrderGroupBase_h

#import <UIKit/UIKit.h>
#import "RCA11yViewGroupBase.h"
#import "RCA11yFocusOrderProtocol.h"
#import "RCA11yFocusSequenceDelegate.h"
#import "RCA11yFocusLinkDelegate.h"
#import "RCA11yKeyboardFocusableProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RCA11yNativeProps.h"
#endif

@interface RCA11yViewOrderGroupBase : RCA11yViewGroupBase <RCA11yFocusOrderProtocol, RCA11yKeyboardFocusableProtocol>

- (void)cleanReferences;

@property (nonatomic, strong) NSString* orderGroup;
@property (nonatomic, strong) NSNumber* lockFocus;
@property (nonatomic, strong) NSNumber* orderPosition;
@property (nonatomic, strong) NSString* orderLeft;
@property (nonatomic, strong) NSString* orderRight;
@property (nonatomic, strong) NSString* orderUp;
@property (nonatomic, strong) NSString* orderDown;
@property (nonatomic, strong) NSString* orderForward;
@property (nonatomic, strong) NSString* orderBackward;
@property (nonatomic, strong) NSString* orderLast;
@property (nonatomic, strong) NSString* orderFirst;
@property (nonatomic, strong) NSString* orderId;

@property (nonatomic, strong, readonly) RCA11yFocusSequenceDelegate* sequenceDelegate;
@property (nonatomic, strong, readonly) RCA11yFocusLinkDelegate* linkDelegate;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusOrderProps:(const RCA11y::OrderProps &)oldProps
                     newProps:(const RCA11y::OrderProps &)newProps;
#endif

@end

#endif /* RCA11yViewOrderGroupBase_h */
