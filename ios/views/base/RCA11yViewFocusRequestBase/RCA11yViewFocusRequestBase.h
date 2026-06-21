//
//  RCA11yViewFocusRequestBase.h
//  react-native-a11y
//
//  Keyboard auto-focus + imperative focus/screenReaderFocus (ported from EK
//  RNCEKVViewFocusRequestBase).
//

#ifndef RCA11yViewFocusRequestBase_h
#define RCA11yViewFocusRequestBase_h


#import "RCA11yViewContextMenuBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yNativeProps.h"
#endif

@interface RCA11yViewFocusRequestBase : RCA11yViewContextMenuBase

@property BOOL autoFocus;


#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateFocusRequestProps:(const RCA11y::AutoFocusProps &)oldProps
newProps:(const RCA11y::AutoFocusProps &)newProps;

#endif

- (void)focus;
- (void)screenReaderFocus;

@end

#endif /* RCA11yViewFocusRequestBase_h */
