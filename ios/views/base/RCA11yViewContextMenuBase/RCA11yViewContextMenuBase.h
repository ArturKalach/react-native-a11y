//
//  RCA11yViewContextMenuBase.h
//  react-native-a11y
//
//  Keyboard context-menu press (ported from EK RNCEKVViewContextMenuBase).
//

#ifndef RCA11yViewContextMenuBase_h
#define RCA11yViewContextMenuBase_h


#import "RCA11yViewFocusChangeBase.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCA11yNativeProps.h"
#endif

@interface RCA11yViewContextMenuBase : RCA11yViewFocusChangeBase<UIContextMenuInteractionDelegate>

@property (nonatomic, assign) BOOL enableContextMenu;

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateContextMenuProps:(const RCA11y::ContextMenuProps &)oldProps
newProps:(const RCA11y::ContextMenuProps &)newProps;
#endif

- (void)onContextMenuPressHandler;
- (void)onBubbledContextMenuPressHandler;

@end


#endif /* RCA11yViewContextMenuBase_h */
