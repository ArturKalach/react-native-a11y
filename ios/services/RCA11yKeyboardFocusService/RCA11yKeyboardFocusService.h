//
//  RCA11yKeyboardFocusService.h
//  react-native-a11y
//

#ifndef RCA11yKeyboardFocusService_h
#define RCA11yKeyboardFocusService_h

#import <UIKit/UIKit.h>

/// Public entry point for driving the UIKit focus engine from custom native code.
/// All methods are static — this service holds no state.
@interface RCA11yKeyboardFocusService : NSObject

/// Returns the view currently focused inside the given focus environment, or nil.
+ (UIView *)getFocusedItem:(id<UIFocusEnvironment>)environment;

/// Marks a view as the preferred focus environment without forcing a focus update.
+ (void)updatePreferredFocusEnvironment:(UIView *)view;

/// Moves keyboard focus to the given view on the next focus update.
+ (void)focus:(UIView *)view;

@end

#endif /* RCA11yKeyboardFocusService_h */
