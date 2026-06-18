//
//  RCA11yViewKeyPress.h
//  react-native-a11y
//
//  Physical key down/up dispatch (ported from EK RNCEKVViewKeyPress). Top of the
//  merged keyboard base chain — the screen-reader base chain is re-parented onto
//  this class so A11yView inherits both capabilities.
//

#ifndef RCA11yViewKeyPress_h
#define RCA11yViewKeyPress_h

#import "RCA11yViewFocusRequestBase.h"

@interface RCA11yViewKeyPress : RCA11yViewFocusRequestBase

@property BOOL hasOnPressUp;
@property BOOL hasOnPressDown;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateKeyPressProps:(const RCA11y::KeyPressProps &)oldProps
                   newProps:(const RCA11y::KeyPressProps &)newProps;

#endif

- (void)onKeyDownPressHandler:(NSDictionary *)eventInfo;
- (void)onKeyUpPressHandler:(NSDictionary *)eventInfo;

@end


#endif /* RCA11yViewKeyPress_h */
