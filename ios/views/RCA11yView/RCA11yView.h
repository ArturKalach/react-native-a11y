//
//  RCA11yView.h
//  react-native-a11y
//
//  The merged native view backing `A11y.View` (and `A11y.Index` / `A11y.Pressable`
//  / `A11y.Input`). It unites react-native-a11y-order's RNAOA11yIndexView (screen
//  reader) and react-native-external-keyboard's RNCEKVExternalKeyboardView
//  (physical keyboard) through one linearized base hierarchy:
//
//    RCTViewComponentView
//      → RCA11yViewGroupBase → … → RCA11yViewKeyPress      (keyboard chain)
//        → RCA11ySRViewGroup → … → RCA11ySRViewOrder        (screen-reader chain)
//          → RCA11yView                                      (this leaf)
//
//  Each capability is opt-in: keyboard props drive the keyboard subsystem, SR props
//  drive the SR subsystem, and the shared `orderIndex` is routed by `orderType`.
//

#ifndef RCA11yView_h
#define RCA11yView_h

#import <UIKit/UIKit.h>
#import "RCA11yOptimisticBase.h"
#import "RCA11yKeyboardFocusableProtocol.h"

@interface RCA11yView : RCA11yOptimisticBase <RCA11yKeyboardFocusableProtocol>

// Keyboard wrapper flag — derived from `focusTarget` (≠ self ⇒ wrapper). Overrides
// the base's constant `-focusableWrapper`.
@property BOOL focusableWrapper;

#ifndef RCT_NEW_ARCH_ENABLED
@property (nonatomic, copy) RCTDirectEventBlock onFocusChange;
@property (nonatomic, copy) RCTDirectEventBlock onContextMenuPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyUpPress;
@property (nonatomic, copy) RCTDirectEventBlock onKeyDownPress;
@property (nonatomic, copy) RCTBubblingEventBlock onBubbledContextMenuPress;
#endif

@end

#endif /* RCA11yView_h */
