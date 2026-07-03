//
//  RCA11yKeyboardHaloBase.h
//  react-native-a11y
//
//  Keyboard focus halo/highlight (ported from EK RNCEKVExternalKeyboardHalloBase).
//

#ifndef RCA11yKeyboardHaloBase_h
#define RCA11yKeyboardHaloBase_h

#import "RCA11yViewOrderGroupBase.h"
#import "RCA11yCustomFocusEffectProtocol.h"
#import "RCA11yHaloProtocol.h"

#ifdef RCT_NEW_ARCH_ENABLED
#include "RCA11yNativeProps.h"
#endif

@interface RCA11yKeyboardHaloBase : RCA11yViewOrderGroupBase<RCA11yHaloProtocol, RCA11yCustomFocusEffectProtocol>

@property (nonatomic, assign) CGFloat haloCornerRadius;
@property (nonatomic, assign) CGFloat haloExpendX;
@property (nonatomic, assign) CGFloat haloExpendY;
@property (nonatomic, assign) BOOL isHaloHidden;
@property (nonatomic, assign) BOOL roundedHaloFix;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateHaloProps:(const RCA11y::HaloProps &)oldProps
               newProps:(const RCA11y::HaloProps &)newProps;
#endif

@end

#endif /* RCA11yKeyboardHaloBase_h */
