//
//  RCA11yViewFocusChangeBase.h
//  react-native-a11y
//
//  Keyboard focus enter/leave (ported from EK RNCEKVViewFocusChangeBase).
//

#ifndef RCA11yViewFocusChangeBase_h
#define RCA11yViewFocusChangeBase_h

#import "RCA11yViewGroupIdentifierBase.h"
#import "RCA11yFocusDelegate.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yNativeProps.h"
#endif

@interface RCA11yViewFocusChangeBase : RCA11yViewGroupIdentifierBase<RCA11yFocusProtocol>

@property BOOL canBeFocused;
@property BOOL hasOnFocusChanged;
@property (nonatomic, assign, readonly) BOOL isKeyboardFocused;


@property (nonatomic, strong, readonly) RCA11yFocusDelegate* focusDelegate;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusProps:(const RCA11y::FocusProps &)oldProps
newProps:(const RCA11y::FocusProps &)newProps;
#endif

- (void)onFocusChangeHandler:(BOOL)isFocused;

- (NSNumber *)resolveFocusChange:(UIFocusUpdateContext *)context;

@end


#endif /* RCA11yViewFocusChangeBase_h */
