//
//  RCA11yFocusMemoryService.h
//  react-native-a11y
//

#ifndef RCA11yFocusMemoryService_h
#define RCA11yFocusMemoryService_h

#import <UIKit/UIKit.h>

/// Remembers the focused view inside a focus environment and restores it later.
///
/// Reusable for any "leave then come back" flow — modal presentation, screen
/// navigation, etc. The owner decides *when* to call store / restore; the only
/// difference between flows is the ordering of those two calls:
///
///   Modal:      store on present, restore on dismiss.
///   Navigation: store on disappear, restore on appear.
///
/// The stored view is held weakly, so it never keeps a detached view alive.
@interface RCA11yFocusMemoryService : NSObject

/// Captures the currently focused view in the environment and marks it preferred.
- (void)store:(id<UIFocusEnvironment>)environment;

/// Restores focus to the stored view (if any) and clears the stored reference.
- (void)restore;

/// Returns the currently stored view without consuming it, or nil.
- (UIView *)get;

/// Drops the stored reference without restoring focus.
- (void)clean;

@end

#endif /* RCA11yFocusMemoryService_h */
